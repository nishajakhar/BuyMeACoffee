// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract BuyMeACoffee {
    address payable public owner;
    struct Memo {
        uint timestamp;
         uint amount;
        address donater;
        string name;
        string message;
    }
    Memo[] public memos;

    event MemoAdded(uint timestamp, uint amount, address donater, string name, string message);
    event Withdrawal(uint amount, uint when);

    constructor(){
        owner = payable(msg.sender);
    }

    function buyMeACoffee(string memory _name, string memory _message) payable external returns (bool){
        require(msg.value > 0, "Not Enough ETH to Buy a Coffee");
        Memo memory newDonater = Memo(block.timestamp, msg.value, msg.sender, _name, _message);
        memos.push(newDonater);
        emit MemoAdded(block.timestamp, msg.value, msg.sender, _name, _message);
        return true;
    }


    function withdraw() external {
        owner.transfer(address(this).balance);
        emit Withdrawal(address(this).balance, block.timestamp);

    }

function updateOwner() external {
    require(msg.sender == owner, "Only owner can call this function");
        owner = payable(msg.sender);
    }
    function getMemos() public view returns (Memo[] memory){
        return memos;
    }
}
