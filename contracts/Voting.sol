// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UserVoting {
    struct Lot {
        uint256 votesCount;
        address[] voted;
    }

    struct VotingResult {
        string lotTitle;
        uint256 votesCount;
    }

    address public owner;

    mapping(string => Lot) public lots;
    string[] public allLotsTitles;

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "");
        _;
    }

    modifier lotExists(string memory lotTitle) {
        require(isLotExists(lotTitle), "This lot does not exists");
        _;
    }

    function vote(string memory lotTitle) public lotExists(lotTitle) {
        require(!isUserVoted(lotTitle, msg.sender), "User already voted");
        
        lots[lotTitle].voted.push(msg.sender);
        lots[lotTitle].votesCount += 1;
    }

    function addLot(string memory lotTitle) public onlyOwner {
        require(!isLotExists(lotTitle), "This lot already exists");

        allLotsTitles.push(lotTitle);
        lots[lotTitle] = Lot({
            votesCount: 0,
            voted: new address[](0)
        });
    }

    function getResult() public view returns (VotingResult[] memory) {
        VotingResult[] memory result = new VotingResult[](allLotsTitles.length);
        for (uint256 i = 0; i < allLotsTitles.length; i++) {
            result[i] = VotingResult({
                lotTitle: allLotsTitles[i],
                votesCount: lots[allLotsTitles[i]].votesCount
            });
        }
        return result;
    }

    function isUserVoted(string memory lotTitle, address userAddress) private view returns(bool) {
        Lot memory lot = lots[lotTitle];
        for (uint256 i = 0; i < lot.voted.length; i++) {
            if (lot.voted[i] == userAddress) {
                return true;
            }
        }
        return false;
    }

    function isLotExists(string memory lotTitle) private view returns(bool) {
        for (uint256 i = 0; i < allLotsTitles.length; i++) {
            if (keccak256(abi.encodePacked(allLotsTitles[i])) == keccak256(abi.encodePacked(lotTitle))) {
                return true;
            }
        }

        return false;
    }
}

contract VotingApp {
    struct Voting {
        string title;
        string description;
        address contractAddress;
    }

    address public owner;
    mapping (address=>Voting[]) public userVotings;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function addVoting(string memory _title, string memory _description) public {
        require(!isUserVotingExists(msg.sender, _title), "User already has a vote with this title");

        UserVoting userVoting = new UserVoting(msg.sender);
        userVotings[msg.sender].push(Voting({
            title: _title,
            description: _description,
            contractAddress: address(userVoting)
        }));
    }

    function removeVoting() public {
        delete userVotings[msg.sender];
    }

    function getUserVotings() public view returns (Voting[] memory) {
        return userVotings[msg.sender];
    }

    function isUserVotingExists(address userAddress, string memory votingTitle) private view returns (bool) {
        Voting[] memory _userVotings = userVotings[userAddress];
        
        for (uint i = 0; i < _userVotings.length; i++) {
            if (keccak256(abi.encodePacked(_userVotings[i].title)) == keccak256(abi.encodePacked(votingTitle))) {
                return true;
            }
        }

        return false;
    }
}