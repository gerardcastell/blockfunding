// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title CrowdFunding
 * @dev create and manage crowdfundings
 */
contract CrowdFunding {
    struct Project {
        // Leader of the crowdfunding campaign
        address owner;
        // Title of the crowdfunding
        string title;
        // The amount of wei raised so far
        uint256 balance;
        // Amount of founds the project founder wants to collect
        uint256 ethGoal;
        // Deadline in seconds (unix timestamp)
        uint256 deadline;
        // Bool to show if crowdfunding is sended to the creator
        bool claimed; 
        // Amount that every user has contributed
        //mapping(address => uint256) balanceReceived;
    }

    Project[] projects;
    mapping (address => uint256) addressMap;
    mapping (address => mapping(address => uint256)) donationLedger;

     modifier inTime(address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        require(block.timestamp <= projects[idx].deadline, "Donations are closed");
        _;
    }

    modifier notInTime(address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        require(block.timestamp > projects[idx].deadline, "Donations are still ongoing");
        _;
    }

    modifier isOwner(address _ownerAddr) {
        uint256 idx = getIndexByAddress(_ownerAddr);
        require(msg.sender == projects[idx].owner, "Caller is not the founder");
        _;
    }

    modifier isNotOwner(address _ownerAddr) {
        uint256 idx = getIndexByAddress(_ownerAddr);
        require(msg.sender != projects[idx].owner, "Caller is the founder");
        _;
    }

    modifier isAchieved(address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        require(projects[idx].balance >= projects[idx].ethGoal, "Goal is not achieved");
        _;
    }

    modifier isNotAchieved(address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        require(projects[idx].balance < projects[idx].ethGoal, "Goal is achieved");
        _;
    }

    modifier isNotClaimed (address _crowdFundingAddress) {
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        require(projects[idx].claimed == false, "Funding is already claimed");
        _;
    }

    //PRIVATE FUNCTIONS
    function removeByIndex(uint i) private{
        while (i<projects.length-1) {
            projects[i] = projects[i+1];
            i++;
        }
    }

    function getIndexByAddress(address _address) private view returns(uint256){
        return addressMap[_address];
    }
        
    function deleteProject(address _address) private {
        uint256 idx = addressMap[_address];
        if (idx >= projects.length) return;
        for (uint i = idx; i<projects.length-1; i++){
            projects[i] = projects[i+1];
        }
        delete projects[projects.length-1];
    }

    //PUBLIC FUNCTIONS
    function createProject(string memory _title, uint256 _ethGoal, uint256 _seconds) public {
        Project storage newProject = projects.push();

        newProject.owner = msg.sender;
        newProject.balance = 0;
        newProject.title = _title;
        newProject.ethGoal = _ethGoal * (1 ether);
        newProject.deadline = block.timestamp + _seconds;
        newProject.claimed = false;
         
        addressMap[msg.sender]=projects.length -1;
    }

    function makeDonation(address _crowdFundingAddress) public payable isNotOwner(msg.sender) inTime(_crowdFundingAddress) isNotAchieved(_crowdFundingAddress){
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        projects[idx].balance += msg.value;
        donationLedger[msg.sender][_crowdFundingAddress] += msg.value;
    }

    function getProjects() public view returns(Project[] memory){
        return projects;
    }

    function getProject(address _address) public view returns(Project memory){
        uint256 idx = addressMap[_address];
        return projects[idx];
    }

    function claim(address _crowdFundingAddress) public notInTime(_crowdFundingAddress) isNotAchieved(_crowdFundingAddress) {
        // Check if the user has already claimed his funds
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
        require(
           donationLedger[msg.sender][_crowdFundingAddress] > 0,
           "Donation already claimed"
        );
        
        uint256 _amount = donationLedger[msg.sender][_crowdFundingAddress];
        projects[idx].balance -= _amount;
        donationLedger[msg.sender][_crowdFundingAddress] = 0;

        // Send funds to the donator address
        payable(msg.sender).transfer(_amount);
    }
   
    function withdrawFunds() public isOwner(msg.sender) isAchieved(msg.sender) isNotClaimed(msg.sender) {
        payable(msg.sender).transfer(address(this).balance);     
        uint256 idx = getIndexByAddress(msg.sender);
        projects[idx].claimed = true;
    }
}