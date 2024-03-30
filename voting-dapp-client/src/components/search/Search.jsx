import React, {useEffect, useState} from 'react';
import {ethers} from "ethers";
import { ToastContainer, toast } from 'react-toastify';

import { USER_VOTING_CONTRACT_ABI } from '../../constants/constants'

import './search.css';

const Search = ({ signer }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [lots, setLots] = useState([]);
  const [votingBlock, setVotingBlock] = useState(null);

  const vote = async (lot) => {
    // TODO: сделать проверку проголосовал ли человек
    try {

    } catch (e) {
      toast.error('Ошибка выполнения запроса');
      console.error(e);
    }
  }

  const searchContract = async () => {
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
      );
    }

  }, [lots]);

  return (
    <div className='search'>
      <div className='search-block'>
        <input className='search-block-input'
               value={contractAddress}
               onChange={e => setContractAddress(e.target.value)}
               placeholder='Адрес голосования'/>
        <button className='search-block-button' onClick={() => searchContract()}>
          Поиск
        </button>
      </div>
      <div className='search-content-block'>
        {votingBlock}
      </div>
      <ToastContainer
        position="top-center"
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