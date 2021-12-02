// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.10;

contract CrowdFunding {
    address private owner;
    uint256 public balance;
    uint256 public ethGoal;
    uint256 public deadline;
    mapping(address => uint256) public balanceReceived;
    mapping(address => mapping(uint256 => bool)) public isIndexClaimed; // Amount of ETH each org can claim per claimable event


    constructor(uint8 _days) {
        // msg.sender is the address of the person who deployed the SC
        owner = msg.sender;
        deadline = block.timestamp + _days * 24 * 3600;
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
    
    function setNewDeadline(uint256 _end) public isOwner {
        // TODO
    }

    function makeDonation() public payable inTime {
        assert(msg.value == uint64(msg.value));

        if (msg.value + this.balance > ethGoal) {
            uint64 amountToDonate = ethGoal - this.balance;
            uint64 amountToTxBack = msg.value - amountToDonate;
            
            // send back the amount to the sender
            msg.sender.transfer(amountToTxBack);

            // send the rest to the owner
            address(this).transfer(amountToDonate);
            balanceReceived[msg.sender] += msg.amountToDonate;
        }
        else {
            // send the amount to the owner
            address(this).transfer(msg.value);
            balanceReceived[msg.sender] += msg.value;
        }

        assert(balanceReceived[msg.sender] >= uint64(msg.value));
    }   

        function claim(uint256 _claimIndex) public {            
            if (isIndexClaimed[msg.sender][_claimIndex] == false) {
                isIndexClaimed[msg.sender][_claimIndex] = true;  // Org cannot claim multiple times per index
                msg.sender.transfer(claimAmount[_claimIndex]);
            }
        }


// TODO SC queda bloquejat quan el deadline ha expirat

    function withdrawFunds(address payable _to) public isOwner isAchieved {           
        _to.transfer(address(this).balance);
    }
    

    function retrieve() public isOwner returns (uint256) {
        
        require(address(this).balance < ethGoal, "Goal is achieved");
        require (block.timestamp <= deadline, "Donations are open");

        // TODO 


        return number;
    }
}
