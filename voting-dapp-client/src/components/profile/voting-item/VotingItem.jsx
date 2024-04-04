import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './voting-item.css';

const VotingItem = ({ contract, openVoting }) => {
	const [contractTitle, setContractTitle] = useState(contract.title);
	const [contractAddress, setContractAddress] = useState('');

	useEffect(() => {
		const init = async () => {
			const address = await contract.contract.getAddress();
			setContractAddress(address);
		}

		init();
	}, [])

	const copyAddress = () => {
		navigator.clipboard.writeText(contractAddress);
		toast.success('Адрес голосования скопирован');
	}

	return(
		<div className='voting-item-container'>
			{
				contract.isActive
				?
				<div className="available-contract-title">
					{contractTitle}
				</div>
				:
				<div className='closed-contract-title'>
					{contractTitle}
				</div>
			}
			<div className="contract-address-text">
				{
					`${contractAddress.slice(0, 5)}...${contractAddress.slice(-5, contractAddress.length)}`
				}
			</div>
			<button className='action-button' onClick={() => copyAddress()}>Копировать</button>
			<button className='action-button' onClick={() => openVoting(contract)}>Открыть</button>
			<ToastContainer
				position="bottom-right"
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