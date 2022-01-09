// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BFDToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Blockfunding", "BFD") {
        _mint(msg.sender, initialSupply);
    }
}
