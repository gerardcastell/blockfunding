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

    modifier inTime(uint256 address _ownerAddr) {
        require(block.timestamp <= deadline, "Donations are closed");
        _;
    }

    modifier notInTime() {
        require(block.timestamp > deadline, "Donations are still ongoing");
        _;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not the founder");
        _;
    }

    modifier isNotOwner() {
        require(msg.sender != owner, "Caller is the founder");
        _;
    }

    modifier isAchieved() {
        require(balance >= ethGoal, "Goal is not achieved");
        _;
    }

    modifier isNotAchieved() {
        require(balance < ethGoal, "Goal is achieved");
        _;
    }

    function createNewProject(uint256 _days, uint256 _ethGoal) public {
        Project project = Project(
            msg.sender,
            0,
            _ethGoal * 1000000000000000000,
            block.timestamp + _days * 24 * 3600
        );
        project[msg.sender] = project;
    }

    function makeDonation() public payable isNotOwner inTime isNotAchieved {
        assert(msg.value == uint64(msg.value));

        Project project = projects[msg.sender];

        // User sends donation to the contract
        project.balanceReceived[msg.sender] += msg.value;
        project.isDonationClaimed[msg.sender][msg.value] == false;
        project.balance += msg.value;

        assert(project.balanceReceived[msg.sender] >= uint64(msg.value));
    }

    function claim(uint256 _amount) public notInTime isNotAchieved {
        Project project = projects[msg.sender];

        // Check if the user has already claimed his funds
        require(
            project.isDonationClaimed[msg.sender][_amount] == false,
            "Donation already claimed"
        );

        _amount = _amount * 1000000000000000000; // Convert to wei
        require(
            project.balanceReceived[msg.sender] - _amount >= 0,
            "Not enough funds"
        );

        project.balanceReceived[msg.sender] -= _amount;

        if (project.balanceReceived[msg.sender] == 0) {
            // Mark that that user with this amount has already claimed funds
            project.isDonationClaimed[msg.sender][_amount] = true;
        }

        project.balance -= _amount;

        // Send funds to the donator address
        payable(msg.sender).transfer(_amount);
    }

    function withdrawFunds(address payable _to) public isOwner isAchieved {
        _to.transfer(address(this).balance);
    }
}
