// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "remix_tests.sol"; // this import is automatically injected by Remix.
import "remix_accounts.sol";
import "../contracts/0_custom_sc.sol";

contract CrowdFundingTest {   
    CrowdFunding crowdfunding;
    CrowdFunding.Project projectToTest;

    // Define variables referring to different accounts
    address acc0;
    address acc1;
    address acc2;

    function beforeAll () public {
        crowdfunding = new CrowdFunding();

        acc0 = TestsAccounts.getAccount(0); 
        acc1 = TestsAccounts.getAccount(1);
        acc2 = TestsAccounts.getAccount(2);
    }
    
    function testItCreatesAProject() public {
        string memory title = "Project test";
        uint ethGoal = 5;
        uint deadline = 60;
        crowdfunding.createProject(title, ethGoal, deadline);

        CrowdFunding.Project[] memory projects = crowdfunding.getProjects();
        projectToTest = projects[0];

        Assert.equal(title, projects[0].title, "It should store the same title.");
        Assert.equal(ethGoal * 1 ether, projects[0].ethGoal, "It should store the same goal.");
        Assert.equal(block.timestamp + deadline, projects[0].deadline, "It should store the same deadline.");
        Assert.equal(acc1, projects[0].owner, "It should store the owner.");
    }

  
    

}
