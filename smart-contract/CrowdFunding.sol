// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title CrowdFunding
 * @dev create and manage crowdfundings
 */
contract CrowdFunding {
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
      
        //mapping(address => uint256) balanceReceived;
    }

    Project[] projects;
    mapping (address => uint256) addressMap;
    // Amount that every user has contributed
    mapping (address => mapping(address => uint256)) donationLedger;


    modifier inTime(bool isInTime, address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        if(isInTime){
            require(block.timestamp <= projects[idx].deadline, "Donations are closed");
        }else{
            require(block.timestamp > projects[idx].deadline, "Donations are still ongoing");
        }
        _;
    }

    modifier onlyOwner(bool isOwner, address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        if(isOwner){
            require(msg.sender == projects[idx].owner, "Caller is not the founder");
        }else{
            require(msg.sender != projects[idx].owner, "Caller is the founder");
        }
        _;
    }

    modifier achieved(bool isAchieved, address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        if(isAchieved){
            require(projects[idx].balance >= projects[idx].ethGoal, "Goal is not achieved");
        }else{
            require(projects[idx].balance < projects[idx].ethGoal, "Goal is achieved");
        }
        _;
    }

    modifier fundraised (bool isPaid, address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        if(isPaid){
            require(projects[idx].claimed == true, "Funding is not claimed yet");
        }else{
            require(projects[idx].claimed == false, "Funding is already claimed");
        }
        _;
    }

    modifier claimed (bool isClaimed, address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        if(isClaimed){
            require(donationLedger[msg.sender][_crowdFundingAddress] == 0, "Donation not claimed yet.");
        }else{
            require(donationLedger[msg.sender][_crowdFundingAddress] > 0, "Donation already paid back.");
        }
        _;
    }

    //PRIVATE FUNCTIONS
    function getIndexByAddress(address _address) private view returns(uint256){
        return addressMap[_address];
    }
        
    function deleteProject(address _address) private {
        uint256 idx = getIndexByAddress(_address);
        if (idx >= projects.length) return;
        for (uint i = idx; i<projects.length-1; i++){
            projects[i] = projects[i+1];
        }
        delete projects[projects.length-1];
    }

    function getRandom() private view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp)))));
    } 

    //PUBLIC & EXTERNAL FUNCTIONS
    function createProject(string memory _title, uint256 _ethGoal, uint256 _seconds) external {
        Project storage newProject = projects.push();
        address projectId = getRandom();

        newProject.id = projectId;
        newProject.owner = msg.sender;
        newProject.balance = 0;
        newProject.title = _title;
        newProject.ethGoal = _ethGoal * (1 ether);
        newProject.deadline = block.timestamp + _seconds;
        newProject.claimed = false;
        addressMap[projectId]=projects.length -1;
    }

    function makeDonation(address _crowdFundingAddress) external payable onlyOwner(false, _crowdFundingAddress) inTime(true, _crowdFundingAddress) achieved(false, _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        projects[idx].balance += msg.value;
        donationLedger[msg.sender][_crowdFundingAddress] += msg.value;
    }

    function getProjects() external view returns(Project[] memory) {
        return projects;
    }

    function getProject(address _address) external view returns(Project memory) {
        uint256 idx = getIndexByAddress(_address);
        return projects[idx];
    }

    function claim(address _crowdFundingAddress) external inTime(false, _crowdFundingAddress) achieved(false, _crowdFundingAddress) claimed(false, _crowdFundingAddress)  {
        // Check if the user has already claimed his funds
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        uint256 _amount = donationLedger[msg.sender][_crowdFundingAddress];
        
        projects[idx].balance -= _amount;
        donationLedger[msg.sender][_crowdFundingAddress] = 0;

        // Send funds to the donator address
        payable(msg.sender).transfer(_amount);

    }
   
    function withdrawFundsOfProject(address _crowdFundingAddress) public onlyOwner(true, _crowdFundingAddress) achieved(true, _crowdFundingAddress) fundraised(false, _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        uint256 amount = projects[idx].balance;
        projects[idx].claimed = true;
      
        payable(msg.sender).transfer(amount);     
    }
}