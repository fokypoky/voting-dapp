import React, { useEffect, useState } from 'react';

import './styles/styles.css';

import Login from './components/login/Login';
import Voting from './components/voting/Voting';


function App() {
	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);

	useEffect(() => {
		if (signer) {
			console.log(signer.address);
		}
	}, [signer]);

	return (
		signer
			?
			<Voting provider={provider} signer={signer} />
			:
			<Login setProvider={setProvider} setSigner={setSigner} />
	);
}

export default App;