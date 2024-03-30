import { ethers } from "ethers";
import React, { useEffect, useState } from 'react';
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

  const addVoting = (votingTitle) => {
    setTimeout( () => {
      const add = async () => {
        try {
          const address = await getAppContract().getVoting(votingTitle);
          const contract = {
            title: votingTitle,
            contract: new ethers.Contract(
              address, VOTING_APP_CONTRACT_ABI, signer
            )
          }

          const contracts = Array.from(userContracts);
          contracts.push(contract);
          setUserContracts(contracts);
        } catch (e) {
          console.log(e);
        }
      }

      add();
    }, 17000)
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

  useEffect(() => {
    console.log('render');
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
        <AddVoting appContract={getAppContract()} addVoting={addVoting} signer={signer}/>
      </div>
      <div className='votings-container'>
        {contractsBlock}
      </div>
    </div>
  );
};

export default Profile;