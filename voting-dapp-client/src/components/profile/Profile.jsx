import { ethers } from "ethers";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { USER_VOTING_CONTRACT_ABI, VOTING_APP_CONTRACT_ABI, VOTING_APP_CONTRACT_ADDRESS } from '../../constants/constants';
import AddVoting from "./add_voting/AddVoting";
import './profile.css';
import VotingBlock from "./voting-block/VotingBlock";
import VotingItem from "./voting-item/VotingItem";

const Profile = ({ signer, provider, setSelectedBlock }) => {
  const [userContracts, setUserContracts] = useState([]);
  const [contractsBlock, setContractsBlock] = useState(<p>У вас нет голосований</p>);

  const getAppContract = () => {
    return new ethers.Contract(
      VOTING_APP_CONTRACT_ADDRESS, VOTING_APP_CONTRACT_ABI, signer
    );
  }

  const openVoting = (contract) => {
    setSelectedBlock(<VotingBlock contract={contract} setSelectedBlock={setSelectedBlock}
                                  signer={signer}
                                  provider={provider}/>)
  }

  const getUserContracts = async (appContract) => {
    const userVotingTitles = await appContract.getUserVotingTitles();
    const userContracts = [];

    for (const votingTitle of userVotingTitles) {
      if (votingTitle === '') {
        continue;
      }

      const contractAddress = await appContract.getVoting(votingTitle);
      const contract = new ethers.Contract(
        contractAddress, USER_VOTING_CONTRACT_ABI, signer
      );
      
      const isContractActive = await contract.getIsActive();

      userContracts.push({
        title: votingTitle,
        contract: contract,
        isActive: isContractActive
      });
    }

    return userContracts;
  }

  const refreshVotings = async () => {
    try {
      const userContracts = await getUserContracts(getAppContract());
      setUserContracts(userContracts);
    } catch (e) {
      toast.error('Ошибка подключения к сети блокчейн');
      console.error(e);
    }
  }

  useEffect(() => {
    const init = async () => {
      const appContract = getAppContract();
      const userContracts = await getUserContracts(appContract);
      setUserContracts(userContracts);
    };

    init();
  }, []);

  useEffect(() => {
    if(userContracts.length > 0) {
      setContractsBlock(userContracts.map(contract => {
        return <VotingItem contract={contract} openVoting={openVoting}/>
      }));
    }
  }, [userContracts]);

  return (
    <div className='profile-block'>
      <div className="profile-header">
        <p>Аккаунт: {signer.address}</p>
      </div>
      <div className='add-voting-block'>
        <AddVoting appContract={getAppContract()} signer={signer}/>
        <button className='add-voting-block-refresh-button' onClick={refreshVotings}/>
      </div>
      <div className='votings-container'>
        {contractsBlock}
      </div>
    </div>
  );
};

export default Profile;