import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';


import 'react-toastify/dist/ReactToastify.css';
import './add-voting.css';

const AddVoting = ({ appContract, signer }) => {
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
			const transactionResult = await appContract.addVoting(votingTitle);
			
			toast.info('Подождите пока транзакция добавится в сеть блокчейн', { duration: 5000});

			await transactionResult.wait();
			toast.success('Голосование добавлено', { duration: 5000 });
		} catch (e) {
			toast.error('Ошибка выполнения транзакции');
			console.error(e);
		}
	}

	return (
		<div className='add-voting-block'>
			<div>Название: </div>
			<div>
				<input type='text' value={votingTitle}
							onChange={e => setVotingTitle(e?.target.value)}
							className='add-voting-input'
							onKeyPress={e => {
								if(e.key === 'Enter') {
									createVoting();
								}
							}}/>
			</div>
			<div>
				<button className='add-voting-button' onClick={createVoting}>Добавить</button>
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

export default AddVoting;