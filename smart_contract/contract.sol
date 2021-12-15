// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.10;

contract CrowdFunding {
    // Leader of the crowdfunding campaign
    address public owner;

    // The amount of wei raised so far
    uint256 public balance;

    // Amount of founds the project founder wants to collect
    uint256 public ethGoal;

    // Deadline in seconds (unix timestamp)
    uint256 public deadline;

    // Amount that every user has contributed
    mapping(address => uint256) public balanceReceived;

    // Amount of ETH each org can claim per claimable event
    mapping(address => mapping(uint256 => bool)) public isDonationClaimed;

    constructor(uint256 _days, uint256 _ethGoal) {
        owner = msg.sender;
        deadline = block.timestamp + _days * 24 * 3600;
        ethGoal = _ethGoal * 1000000000000000000; // convert to wei
    }

    modifier inTime() {
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

    function makeDonation() public payable isNotOwner inTime isNotAchieved {
        assert(msg.value == uint64(msg.value));

        // User sends donation to the contract
        balanceReceived[msg.sender] += msg.value;
        isDonationClaimed[msg.sender][msg.value] == false;
        balance += msg.value;

        assert(balanceReceived[msg.sender] >= uint64(msg.value));
    }

    function claim(uint256 _amount) public notInTime isNotAchieved {
        // Check if the user has already claimed his funds
        require(
            isDonationClaimed[msg.sender][_amount] == false,
            "Donation already claimed"
        );

        _amount = _amount * 1000000000000000000; // Convert to wei
        require(balanceReceived[msg.sender] - _amount >= 0, "Not enough funds");

        balanceReceived[msg.sender] -= _amount;

        if (balanceReceived[msg.sender] == 0) {
            // Mark that that user with this amount has already claimed funds
            isDonationClaimed[msg.sender][_amount] = true;
        }

        balance -= _amount;

        // Send funds to the donator address
        payable(msg.sender).transfer(_amount);
    }

    function withdrawFunds(address payable _to) public isOwner isAchieved {
        _to.transfer(address(this).balance);
    }
}
