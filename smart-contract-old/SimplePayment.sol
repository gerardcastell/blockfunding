// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.1;

contract SimplePayment {

    // public storage variable. 
    //  public variable will create a getter function automatically in Solidity.
    // So we can always query the current content of this variable
    uint256 public balanceReceived;

    function receiveMoney() public payable {
        balanceReceived += msg.value;
    }

    function getBalance() public view returns(uint) {
        // Here casting the instance of the SC to "address" type and then getting the balance.
        return address(this).balance;
    }

    function withdrawMoney() public {
        // msg refers to the message received by the SC
        // The payable keyword makes the method able to send/receive ether
        address payable to = payable(msg.sender);
        
        // Transfer is a buit in method for payable objects
        to.transfer(getBalance());
    }

    function withdrawMoneyTo(address payable _to) public {
        _to.transfer(getBalance());
    }
}