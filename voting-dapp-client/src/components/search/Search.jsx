import { ethers } from "ethers";
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { USER_VOTING_CONTRACT_ABI } from '../../constants/constants';

import './search.css';
import CommentsBlock from "./comments/CommentsBlock";

const Search = ({ signer }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [lots, setLots] = useState([]);
  const [votingBlock, setVotingBlock] = useState(null);

  const vote = async (lot) => {
    try {
      const isVoted = await contract.voted(signer.address);
      
      if(isVoted) {
        toast.error('Вы уже голосовали', {autoClose: 5000});
        return;
      }
      
      await contract.vote(lot.title);

      toast.info('Подождите пока транзакция добавится в сеть блокчейн', {autoClose: 20000})
      setTimeout(() => {
        const _lots = Array.from(lots);

        _lots.at(_lots.indexOf(lot)).votesCount += 1;
        setLots(_lots);
      }, 20000);
    } catch (e) {
      toast.error('Ошибка выполнения запроса');
      console.error(e);
    }
  }

  const searchContract = async () => {
    setLots([]);
    if (!contractAddress) {
      toast.error('Введите адрес голосования');
      return;
    }

    try {
      // проверка существования контракта
      // если контракта не существует выбросит exception
      await signer.provider.getCode(contractAddress);
      setContract(new ethers.Contract(
        contractAddress, USER_VOTING_CONTRACT_ABI, signer
      ));
    } catch (e) {
      toast.error('Во время выполнения запроса возникла ошибка');
      console.error(e);
    }
  }

  useEffect(() => {
    if (!contract) {
      return;
    }

    const init = async () => {
      try {
        const lotsTitles = await contract.getAllLotsTitles();
        const lots = [];

        for(const lotTitle of lotsTitles) {
          if(!lotTitle) {
            continue;
          }

          const votesCount = await contract.getLotVotes(lotTitle);
          lots.push({
            title: lotTitle,
            votesCount: parseInt(votesCount)
          });
        }

        setLots(lots);
      } catch (e) {
        toast.error('Возникла ошибка во время получения данных из контракта');
        console.error(e);
      }
    }

    init();
  }, [contract]);

  useEffect(() => {
    if (lots.count > 0 || contract ) {
      setVotingBlock(
        <div>
          <div>
            <table className='voting-element-lots-table'>
              <thead>
              <tr>
                <th>№</th>
                <th>Название</th>
                <th>Количество голосов</th>
                <th>Действие</th>
              </tr>
              </thead>
              <tbody>
              {
                lots.length === 0
                ?
                <tr>
                  <td colSpan='4'>
                    <div className="empty-lots-block voting-element-lots-table-item">Нет кандидатов</div>
                  </td>
                </tr>
                :
                lots.map((lot, index) => {
                  return (
                    <tr>
                      <td>
                        <div className="voting-element-lots-table-item">
                          { index + 1 }
                        </div>
                      </td>
                      <td>
                        <div className="voting-element-lots-table-item">
                          { lot.title }
                        </div>
                      </td>
                      <td>
                        <div className="voting-element-lots-table-item">
                          { lot.votesCount }
                        </div>
                      </td>
                      <td>
                        <div className="voting-element-lots-table-item">
                          <button className='vote-button'
                            onClick={() => vote(lot)}>
                            Проголосовать
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
              </tbody>
            </table>
          </div>
          <CommentsBlock contract={contract}/>
        </div>
      );
    }

  }, [lots]);

  return (
    <div className='search'>
      <div className='search-block'>
        <input className='search-block-input'
              value={contractAddress}
              onChange={e => setContractAddress(e.target.value)}
              placeholder='Адрес голосования'
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  searchContract();
                }
              }}/>
        <button className='search-block-button' onClick={() => searchContract()}>
          Поиск
        </button>
      </div>
      <div className='search-content-block'>
        {votingBlock}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Search;