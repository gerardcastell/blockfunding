// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title BlockFunding
 * @dev Store & retrieve value in a variable
 */
contract BlockFunding {
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
        // Amount that every user has contributed
        //mapping(address => uint256) balanceReceived;
        // Amount of ETH each org can claim per claimable event
        //mapping(address => mapping(uint256 => bool)) isDonationClaimed;
    }

    uint256 number;
    Project[] projects;
    mapping (address => uint256) addressMap;
    mapping (address => mapping(address => uint256)) fundingLedger;

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

    function createProject(string memory _title, uint256 _ethGoal, uint256 _seconds) public {
        Project storage newProject = projects.push();
        //Project({owner:msg.sender,balance:0, ethGoal:_ethGoal, deadline: block.timestamp + _seconds}); 
        //projects.push(newProject);

        newProject.owner = msg.sender;
        newProject.balance = 0;
        newProject.title = _title;
        newProject.ethGoal = _ethGoal * (1 ether);
        newProject.deadline = block.timestamp + _seconds;
         
        addressMap[msg.sender]=projects.length -1;
    }

    function makeDonation(address _crowdFundingAddress) public payable isNotOwner(msg.sender) inTime(_crowdFundingAddress) isNotAchieved(_crowdFundingAddress){
        uint256 idx = getIndexByAddress(_crowdFundingAddress);
     
        projects[idx].balance += msg.value;
        fundingLedger[msg.sender][_crowdFundingAddress] += msg.value;
    }


    function getProjects() public view returns(Project[] memory){
        return projects;
    }

    function getProject(address _address) public view returns(Project memory){
        uint256 idx = addressMap[_address];
        return projects[idx];
    }

    function getProjectsLength() public view returns(uint256){
        return projects.length;
    }

    function removeByIndex(uint i) private{
        while (i<projects.length-1) {
            projects[i] = projects[i+1];
            i++;
        }
    }
    
    function deleteProject(address _address) public {
        uint256 idx = addressMap[_address];
       // detele projects[idx];
       // removeByIndex(idx);

        if (idx >= projects.length) return;

        for (uint i = idx; i<projects.length-1; i++){
            projects[i] = projects[i+1];
        }
        delete projects[projects.length-1];
        //projects.length--;
    
    }

    function getIndexByAddress(address _address) private view returns(uint256){
        return addressMap[_address];
    }
 
}