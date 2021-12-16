// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


pragma solidity >=0.8.7 <0.9.0;

contract CrowdFunding {
    struct Project {
        // Leader of the crowdfunding campaign
        address owner;
        // The amount of wei raised so far
        uint256 balance;
        // Amount of founds the project founder wants to collect
        uint256 ethGoal;
        // Deadline in seconds (unix timestamp)
        uint256 deadline;
        // Amount that every user has contributed
        mapping(address => uint256) balanceReceived;
        // Amount of ETH each org can claim per claimable event
        mapping(address => mapping(uint256 => bool)) isDonationClaimed;
    }

    // Mapping of crowdfunding address to the its Project struct
    mapping(address => Project) projects;
    // List of crowdfunding projects
    Project[] crowdfundingList;

    modifier inTime(address _crowdFundingAddress) {
        require(block.timestamp <= projects[_crowdFundingAddress].deadline, "Donations are closed");
        _;
    }

    modifier notInTime(address _crowdFundingAddress) {
        require(block.timestamp > projects[_crowdFundingAddress].deadline, "Donations are still ongoing");
        _;
    }

    modifier isOwner(address _ownerAddr) {
        require(msg.sender == projects[_ownerAddr].owner, "Caller is not the founder");
        _;
    }

    modifier isNotOwner(address _ownerAddr) {
        require(msg.sender != projects[_ownerAddr].owner, "Caller is the founder");
        _;
    }

    modifier isAchieved(address _crowdFundingAddress) {
        require(projects[_crowdFundingAddress].balance >= projects[_crowdFundingAddress].ethGoal, "Goal is not achieved");
        _;
    }

    modifier isNotAchieved(address _crowdFundingAddress) {
        require(projects[_crowdFundingAddress].balance < projects[_crowdFundingAddress].ethGoal, "Goal is achieved");
        _;
    }

    function createNewProject(uint256 _days, uint256 _ethGoal) public {
        projects[msg.sender].owner = msg.sender;
        projects[msg.sender].balance = 0;
        projects[msg.sender].ethGoal =  _ethGoal * 1000000000000000000;
        projects[msg.sender].deadline =  block.timestamp + _days * 24 * 3600;

        // crowdfundingList.push(project);
        assert(projects[msg.sender].owner == msg.sender);
        assert(projects[msg.sender].balance == 0);
        assert(projects[msg.sender].ethGoal ==  _ethGoal * 1000000000000000000);
        assert(projects[msg.sender].deadline ==  block.timestamp + _days * 24 * 3600);

    }

    function makeDonation(address _crowdFundingAddress) public payable isNotOwner(msg.sender) inTime(_crowdFundingAddress) isNotAchieved(_crowdFundingAddress) {

        projects[_crowdFundingAddress].balanceReceived[msg.sender] += msg.value;
        projects[_crowdFundingAddress].isDonationClaimed[msg.sender][msg.value] == false;
        projects[_crowdFundingAddress].balance += msg.value;
        //assert(projects[_crowdFundingAddress].balanceReceived[_crowdFundingAddress] >= uint64(msg.value));
    }

    function claim(address _crowdFundingAddress, uint256 _amount) public notInTime(_crowdFundingAddress) isNotAchieved(_crowdFundingAddress) {
        // Check if the user has already claimed his funds
        require(
            projects[_crowdFundingAddress].isDonationClaimed[msg.sender][_amount] == false,
            "Donation already claimed"
        );

        _amount = _amount * 1000000000000000000; // Convert to wei
        require(
            projects[_crowdFundingAddress].balanceReceived[msg.sender] - _amount >= 0,
            "Not enough funds"
        );

        projects[_crowdFundingAddress].balanceReceived[msg.sender] -= _amount;

        if (projects[_crowdFundingAddress].balanceReceived[msg.sender] == 0) {
            // Mark that that user with this amount has already claimed funds
            projects[_crowdFundingAddress].isDonationClaimed[msg.sender][_amount] = true;
        }

        projects[_crowdFundingAddress].balance -= _amount;

        // Send funds to the donator address
        payable(msg.sender).transfer(_amount);
    }
   
    function withdrawFunds(address payable _to) public isOwner(msg.sender) isAchieved(msg.sender) {
        payable(msg.sender).transfer(address(this).balance);       
    }
}
