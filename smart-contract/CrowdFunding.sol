// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title CrowdFunding
 * @dev create and manage crowdfundings
 */
contract CrowdFunding {

    //Project is the struct that we will store the core data for each crowdfunding
    struct Project {
        // Title of the crowdfunding
        string title;
        // Project identifier
        address id;
        // Leader of the crowdfunding campaign
        address owner;
        // The amount of wei raised so far
        uint256 balance;
        // Amount of founds the project founder wants to collect
        uint256 ethGoal;
        // Deadline in seconds (unix timestamp)
        uint256 deadline;
        // Bool to show if crowdfunding is sended to the creator
        bool claimed; 
    }

    // It is the array of Projects stored in the smart contract
    // Initially, it was a mapping(address=>Project) but at the end we realised that was easier for us to deal with
    // an array instead of a mapping that has nested a struct since the logic was pretty more simple regarding
    // our knowledge with Solidity
    Project[] projects;
    
    // It assigns to each address of project a unique index position of the "projects" array aforedeclared
    mapping (address => uint256) addressMap;
    
    // Ledger with the amount that every user has contributed to a certain project
    mapping (address => mapping(address => uint256)) donationLedger;

    // Checks the time of the deadline for the selected project address
    modifier inTime(bool isInTime, address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        if(isInTime){
            require(block.timestamp <= projects[idx].deadline, "Donations are closed");
        }else{
            require(block.timestamp > projects[idx].deadline, "Donations are still ongoing");
        }
        _;
    }

    // Checks if the sender is the owner of the selected project
    modifier onlyOwner(bool isOwner, address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        if(isOwner){
            require(msg.sender == projects[idx].owner, "Caller is not the founder");
        }else{
            require(msg.sender != projects[idx].owner, "Caller is the founder");
        }
        _;
    }

    // Checks if the project received as param has achieved the goal initially defined
    modifier achieved(bool isAchieved, address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        if(isAchieved){
            require(projects[idx].balance >= projects[idx].ethGoal, "Goal is not achieved");
        }else{
            require(projects[idx].balance < projects[idx].ethGoal, "Goal is achieved");
        }
        _;
    }

    // Checks if the balance of the projects has been sent to the creator.
    modifier fundraised (bool isPaid, address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        if(isPaid){
            require(projects[idx].claimed == true, "Funding is not claimed yet");
        }else{
            require(projects[idx].claimed == false, "Funding is already claimed");
        }
        _;
    }

    //Checks if the amount donated to the project by the user has been claimed 
    modifier claimed (bool isClaimed, address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        if(isClaimed){
            require(donationLedger[msg.sender][_crowdFundingAddress] == 0, "Donation not claimed yet.");
        }else{
            require(donationLedger[msg.sender][_crowdFundingAddress] > 0, "Donation already paid back.");
        }
        _;
    }

    // ******* PRIVATE FUNCTIONS ***********
    // Get the index of the project in the "projects" array by an address
    function getIndexByAddress(address _address) private view returns(uint256){
        return addressMap[_address];
    }

    //Get a random address to be the key of a new project
    function getRandomAddress() private view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp)))));
    } 

    //PUBLIC & EXTERNAL FUNCTIONS
    // Creates a new project assigning the basic properties to the struct
    function createProject(string memory _title, uint256 _ethGoal, uint256 _seconds) external {
        Project storage newProject = projects.push();
        address projectId = getRandomAddress();

        newProject.id = projectId;
        newProject.owner = msg.sender;
        newProject.balance = 0;
        newProject.title = _title;
        newProject.ethGoal = _ethGoal * (1 ether);
        newProject.deadline = block.timestamp + _seconds;
        newProject.claimed = false;
        addressMap[projectId]=projects.length -1;
    }

    // Makes a donation to the referenced project address transfering the paid amount to the balance of the project
    // It also stores in the donation ledger the amount donated to such a project
    // Modifiers: Owner can not donate himself, donation must be before deadline and the crowdfunding can not be achieved yet
    function makeDonation(IERC20 bfd_token, address _crowdFundingAddress) external payable onlyOwner(false, _crowdFundingAddress) inTime(true, _crowdFundingAddress) achieved(false, _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);

        bfd_token.transferFrom(address(msg.sender), address(this), msg.value);
        
        projects[idx].balance += msg.value;
        donationLedger[msg.sender][_crowdFundingAddress] += msg.value;
    }

    // Returns all the projects created in the smart contract
    function getProjects() external view returns(Project[] memory) {
        return projects;
    }

    // Returns the project by address
    function getProject(address _address) external view returns(Project memory) {
        uint256 idx = getIndexByAddress(_address);
        return projects[idx];
    }

    // Pays to the sender the amount donated to a certain project. To do so, it gets from the donation ledger the amount donated by that user to the selected project id. 
    // Such an amount is removed from the ledger and also from the balance of the project, then is paid back to the sender.
    // Modifiers: deadline is past, the crowdfunding have not been achieved and finally, the user has not claimed the donation yet
    function claim(IERC20 bfd_token, address _crowdFundingAddress) external inTime(false, _crowdFundingAddress) achieved(false, _crowdFundingAddress) claimed(false, _crowdFundingAddress)  {
        // Check if the user has already claimed his funds
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        uint256 _amount = donationLedger[msg.sender][_crowdFundingAddress];
        
        projects[idx].balance -= _amount;
        donationLedger[msg.sender][_crowdFundingAddress] = 0;

        // Send funds to the donator address
        // payable(msg.sender).transfer(_amount);
        bfd_token.transferFrom(address(this),address(msg.sender), _amount);
    }
   
    // Pays the balance of the project to the initiator of the crowfunding. It gets the amount raised and it is paid to the project creator.
    // The project store that the funding is already paid and the balance now is 0.
    // Modifiers: Caller has to be the owner,goal has been achieved and the owner has not claimed the funding yet
    function withdrawFundsByProject(IERC20 bfd_token, address _crowdFundingAddress) public onlyOwner(true, _crowdFundingAddress) achieved(true, _crowdFundingAddress) fundraised(false, _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        uint256 amount = projects[idx].balance;
        projects[idx].claimed = true;
        projects[idx].balance = 0;

        // payable(msg.sender).transfer(amount);     
        bfd_token.transferFrom(address(this), address(msg.sender), amount);        
    }

    function getProjectBalance (IERC20 bfd_token, address _crowdFundingAddress) public view returns (uint256){
        return bfd_token.balanceOf(_crowdFundingAddress);
    }

    function getTotalSupply (IERC20 bfd_token) public view returns (uint256) {
        return bfd_token.totalSupply();
    }
}