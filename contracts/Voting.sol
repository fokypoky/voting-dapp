// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UserVoting {
    address public owner;

    // lot title -> votes count
    mapping(string => uint256) public lots;

    // voted wallets
    mapping (address => bool) public voted;

    // for check lot existings for O(1) 
    mapping (string => bool) public lotsExists;

    string[] public allLotsTitles;

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can execute");
        _;
    }

    function addLot(string memory title) public onlyOwner {
        require(!lotsExists[title], "Lot already exists");

        lotsExists[title] = true;
        allLotsTitles.push(title);
        lots[title] = 0;
    }
    
    function removeLot(string memory lotTitle) public onlyOwner {
        require(lots[lotTitle] == 0, "Unable to delete a lot that has already been voted on");
        require(lotsExists[lotTitle], "This lot does not exists");

        lots[lotTitle] = 0;
        lotsExists[lotTitle] = false;

        for (uint256 i = 0; i < allLotsTitles.length; i++) {
            if (keccak256(abi.encodePacked(allLotsTitles[i])) == keccak256(abi.encodePacked(lotTitle))) {
                delete allLotsTitles[i];
            }
        }
    }

    function vote(string memory lotTitle) public {
        require(!voted[msg.sender], "This wallet has already been voted on");
        require(lotsExists[lotTitle], "This lot does not exists");

        voted[msg.sender] = true;
        lots[lotTitle] += 1;
    }

    function getAllLotsTitles() public view returns (string[] memory) {
        return allLotsTitles;
    }
    
    function getLotVotes(string memory lotTitle) public view returns (uint256) {
        return lots[lotTitle];
    }
}

contract VotingApp {
    // wallet address -> voting title -> contract address
    mapping (address => mapping (string => address)) votings;
    mapping (address => string[]) public userVotingTitles;

    function addVoting(string memory title) public {
        require(!isVotingExists(msg.sender, title), "User already has a vote with this title");

        UserVoting userVoting = new UserVoting(msg.sender);
        
        votings[msg.sender][title] = address(userVoting);
        userVotingTitles[msg.sender].push(title);
    }

    function removeVoting(string memory title) public {
        votings[msg.sender][title] = address(0);
        for (uint256 i = 0; i < userVotingTitles[msg.sender].length; i++) {
            if (keccak256(abi.encodePacked(userVotingTitles[msg.sender][i])) == keccak256(abi.encodePacked(title))) {
                delete userVotingTitles[msg.sender][i];
            }
        }
    }

    function getVoting(string memory title) public view returns(address) {
        return votings[msg.sender][title];
    }

    function getUserVotingTitles() public view returns (string[] memory) {
        return userVotingTitles[msg.sender];
    }

    function isVotingExists(address userAddress, string memory votingTitle) public view returns (bool) {
        return votings[userAddress][votingTitle] != address(0);
    }
}