// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.10;

contract CrowdFunding {
    address public owner;
    uint256 public balance;
    uint256 public ethGoal;
    uint256 public deadline;
    mapping(address => uint256) public balanceReceived;
    mapping(address => mapping(uint256 => bool)) public isDonationClaimed; // Amount of ETH each org can claim per claimable event

    constructor(uint16 _days, uint256 _ethGoal) {
        // msg.sender is the address of the person who deployed the SC
        owner = msg.sender;
        // deadline = block.timestamp + _days * 24 * 3600; // TODO why is not working?
        deadline = 100000000000000000000;

        // Save the amount of ETH the person wants to raise in ether
        ethGoal = _ethGoal * 1000000000000000000;
    }

    // modifier to check if the owner still accepts donations
    modifier inTime() {
        require(block.timestamp <= deadline, "Donations are closed");
        _;
    }

    // modifier to check if caller is owner
    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier isAchieved() {
        require(balance >= ethGoal, "Goal is not achieved");
        _;
    }

    // function makeDonation() public payable inTime {
    function makeDonation() public payable {
        require(balance <= ethGoal, "Goal is achieved");

        assert(msg.value == uint64(msg.value));

        // User sends donation to the contract
        balanceReceived[msg.sender] += msg.value;
        balance += msg.value;

        assert(balanceReceived[msg.sender] >= uint64(msg.value));
    }

    // TODO not working, everyone can claim
    function claim(uint256 _amount) public {
        // Check if the user has already claimed his funds
        require(
            isDonationClaimed[msg.sender][_amount] == false,
            "Donation already claimed"
        );

        // TODO If the donator makes more donations??
        // --> We could update the mapping with the new amount + the previous

        // TODO If the donator selects a lower amount than the one he has donated?

        // Mark that that user with this amount has already claimed funds
        isDonationClaimed[msg.sender][_amount] = true;
        balance -= _amount;

        // Send funds to the donator
        payable(msg.sender).transfer(_amount);
    }

    // TODO SC queda bloquejat quan el deadline ha expirat

    function withdrawFunds(address payable _to) public isOwner isAchieved {
        _to.transfer(address(this).balance);
    }
}
