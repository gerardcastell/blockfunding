// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.10;

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

    // The project's founder
    mapping(address => Project) projects;

    modifier inTime(address _ownerAddr) {
        require(block.timestamp <= projects[_ownerAddr].deadline, "Donations are closed");
        _;
    }

    modifier notInTime(address _ownerAddr) {
        require(block.timestamp > projects[_ownerAddr].deadline, "Donations are still ongoing");
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

    modifier isAchieved(address _ownerAddr) {
        require(projects[_ownerAddr].balance >= projects[_ownerAddr].ethGoal, "Goal is not achieved");
        _;
    }

    modifier isNotAchieved(address _ownerAddr) {
        require(projects[_ownerAddr].balance < projects[_ownerAddr].ethGoal, "Goal is achieved");
        _;
    }

    function createNewProject(uint256 _days, uint256 _ethGoal) public {
        projects[msg.sender].owner = msg.sender;
        projects[msg.sender].balance = 0;
        projects[msg.sender].ethGoal =  _ethGoal * 1000000000000000000;
        projects[msg.sender].deadline =  block.timestamp + _days * 24 * 3600;
        //  Project project = Project(
        //     msg.sender,
        //     0,
        //     _ethGoal * 1000000000000000000,
        //     block.timestamp + _days * 24 * 3600
        // );
    }

    function makeDonation() public payable isNotOwner(msg.sender) inTime(msg.sender) isNotAchieved(msg.sender) {
        assert(msg.value == uint64(msg.value));

        // Project project = projects[msg.sender];

        // User sends donation to the contract
        projects[msg.sender].balanceReceived[msg.sender] += msg.value;
        projects[msg.sender].isDonationClaimed[msg.sender][msg.value] == false;
        projects[msg.sender].balance += msg.value;

        assert(projects[msg.sender].balanceReceived[msg.sender] >= uint64(msg.value));
    }

    function claim(uint256 _amount) public notInTime(msg.sender) isNotAchieved(msg.sender) {
        // Project project = projects[msg.sender];

        // Check if the user has already claimed his funds
        require(
            projects[msg.sender].isDonationClaimed[msg.sender][_amount] == false,
            "Donation already claimed"
        );

        _amount = _amount * 1000000000000000000; // Convert to wei
        require(
            projects[msg.sender].balanceReceived[msg.sender] - _amount >= 0,
            "Not enough funds"
        );

        projects[msg.sender].balanceReceived[msg.sender] -= _amount;

        if (projects[msg.sender].balanceReceived[msg.sender] == 0) {
            // Mark that that user with this amount has already claimed funds
            projects[msg.sender].isDonationClaimed[msg.sender][_amount] = true;
        }

        projects[msg.sender].balance -= _amount;

        // Send funds to the donator address
        payable(msg.sender).transfer(_amount);
    }

    function withdrawFunds(address payable _to) public isOwner(msg.sender) isAchieved(msg.sender) {
        _to.transfer(address(this).balance);
    }
}
