import React, {useEffect, useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import './voting-item.css';
import 'react-toastify/dist/ReactToastify.css';

const VotingItem = ({ contract, openVoting }) => {
	const [contractTitle, setContractTitle] = useState(contract.title);
	const [contractAddress, setContractAddress] = useState('');

	useEffect(() => {
		const init = async () => {
			const address = await contract.contract.getAddress();
			setContractAddress(address);
		}

		init();
	})

	const copyAddress = () => {
		navigator.clipboard.writeText(contractAddress);
		toast.success('Адрес голосования скопирован');
	}

	return(
		<div className='voting-item-container'>
			<div className="contract-title">
				{contractTitle}
			</div>
			<div className="contract-address-text">
				{
					// FIXME: последний символ не добавляется
					`${contractAddress.slice(0, 5)}...${contractAddress.slice(-5, -1)}`
				}
			</div>
			<button className='action-button' onClick={() => copyAddress()}>Копировать</button>
			<button className='action-button' onClick={() => openVoting(contract)}>Открыть</button>
			<ToastContainer
				position="top-center"
				autoClose={1500}
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
	)
}

export default VotingItem;