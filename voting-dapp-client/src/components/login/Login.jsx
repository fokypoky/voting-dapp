import React from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './login.css';

const Login = ({ setProvider, setSigner }) => {
	const notify = (text) => toast.error(text);

	const login = async () => {
		if (!window.ethereum) {
			notify('Ошибка подключения к Metamask');
			return;
		}

		try {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();

			setProvider(provider);
			setSigner(signer);
		} catch (e) {
			notify('Не удалось подключиться к кошельку. Попробуйте снова');
		}
	};

	return (
		<div className="login__grid">
			<div className="login__grid-item">
				<button className='login__grid-btn' onClick={login}>Войти через MetaMask</button>
			</div>
			<ToastContainer
				position="top-center"
				autoClose={5000}
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
};

export default Login;