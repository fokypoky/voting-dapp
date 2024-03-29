import React, {useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import {ethers} from "ethers";

import { USER_VOTING_CONTRACT_ABI } from '../../../constants/constants'

import './add-voting.css';
import 'react-toastify/dist/ReactToastify.css';

const AddVoting = ({ appContract, addVoting, signer }) => {
	const [votingTitle, setVotingTitle] = useState('');

	const createVoting = async () => {
		if(!votingTitle) {
			toast.error('Вы не ввели название голосования');
			return;
		}

		const userVotingTitles = await appContract.getUserVotingTitles();

		if(userVotingTitles.includes(votingTitle)) {
			toast.error('Голосование с таким названием уже существует');
			return;
		}

		try {
			await appContract.addVoting(votingTitle);
			addVoting(votingTitle);
			toast.info('Подождите пока транзакция добавится в сеть блокчейн', {
				autoClose: 17000
			});
		} catch (e) {
			toast.error('Ошибка выполнения транзакции');
		}
	}

	return (
		<div className='add-voting-block'>
			<div>Название: </div>
			<div>
				<input type='text' value={votingTitle}
							 onChange={e => setVotingTitle(e.target.value)}
							 className='add-voting-input'/>
			</div>
			<div>
				<button className='add-voting-button' onClick={createVoting}>Добавить</button>
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

export default AddVoting;