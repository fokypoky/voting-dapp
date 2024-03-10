import React, {useEffect, useState} from 'react';
import {ethers} from "ethers";
import './profile.css';
import { VOTING_APP_CONTRACT_ADDRESS, VOTING_APP_CONTRACT_ABI, USER_VOTING_CONTRACT_ABI } from '../../constants/constants'
import AddVoting from "./add_voting/AddVoting";
import votingItem from "./voting-item/VotingItem";
import VotingItem from "./voting-item/VotingItem";

const Profile = ({ signer, provider }) => {
  const [userContracts, setUserContracts] = useState([]);

  const getAppContract = () => {
     return new ethers.Contract(
      VOTING_APP_CONTRACT_ADDRESS, VOTING_APP_CONTRACT_ABI, signer
    );
  }

  useEffect(() => {
    const init = async () => {
      const appContract = getAppContract();
      const userVotingTitles = await appContract.getUserVotingTitles();

      const userContracts = [];

      for(const votingTitle of userVotingTitles) {
        if(votingTitle === '') {
          continue;
        }

        const contractAddress = await appContract.getVoting(votingTitle);
        userContracts.push({
          title: votingTitle,
          contract: new ethers.Contract(
            contractAddress, USER_VOTING_CONTRACT_ABI, signer
          )
        });
      }

      setUserContracts(userContracts);
    };

    init();
  }, []);

  const openVoting = (contract) => {
    //  TODO: добавить открытие вкладки с голосованием
  }

  return (
    <div className='profile-block'>
      <div className="profile-header">
        <p>Аккаунт: {signer.address}</p>
      </div>
      <div className='add-voting-block'>
        <AddVoting/>
      </div>
      <div className='votings-container'>
        {
          userContracts.length > 0
          ?
          userContracts.map(contract => <VotingItem contract={contract} openVoting={openVoting}/>)
          :
          <p>У вас еще нет голосований</p>
        }
      </div>
    </div>
  );
};

export default Profile;