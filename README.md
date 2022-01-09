# Blockfunding

A blockchain based distributed crowdfunding platform. The goal of this project is to implement a decentralized crowdfunding platform that can be used to raise funds for any project.

This project is a proof of concept to learn the basics of blockchain technology and solidity development. The project is not intended to be a fully functional decentralized crowdfunding platform.

Contributors:
* [@gerardcastell](https://github.com/gerardcastell)
* [@martiriera](https://github.com/martiriera)
* [@sergio-gimenez](https://github.com/sergio-gimenez)

TODO - Add a GIF/image of the frontend

## The BFD token

The economy of the platform is based on a token called BFD. The token is a digital asset that can be used to donate/receive funds. This token is based on the ERC20 standard.

Since the project is a proof of concept, the token has been deployed in the [ropsten testnet](https://ropsten.etherscan.io/token/0xad27579c045df456ec7496dede970d72b67eba3f) with a total supply of 100,000,000 $BFD

## The Crowdfunding smart contract logic

All the logic of the crowdfunding is deployed in the [Crowdfunding](smart-contract/CrowdFunding.sol) smart contract (refer to the widely-commented source file to understand the logic). This contract is also deployed in the rospeten testnet.

## Deployment

TODO - Explain the deployment process @martiriera