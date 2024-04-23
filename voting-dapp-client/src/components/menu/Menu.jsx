import React, {useState} from 'react';
import Home from "../home/Home";
import Info from "../info/Info";
import Profile from "../profile/Profile";
import Search from "../search/Search";
import './menu.css';

const Menu = ({ provider, signer }) => {
	const [selectedBlock, setSelectedBlock] = useState(<Home/>);
	const [currentSigner, setCurrentSigner] = useState(signer);

	window.ethereum.on('accountsChanged', async () => {
		const _signer = await provider.getSigner();
		setSelectedBlock(<Home/>);
		setCurrentSigner(_signer);
	});

	return (
		<div className='voting__grid'>
			<div className='voting__grid-menu'>
				<div className='menu__flex'>
					<button className='menu__home-image-button'
						onClick={() => setSelectedBlock(<Home />)} />
					<button className='menu__profile-image-button'
						onClick={() => setSelectedBlock(<Profile signer={currentSigner} provider={provider}
							setSelectedBlock={setSelectedBlock} />)} />
					<button className='menu__search-image-button' onClick={() => setSelectedBlock(
						<Search signer={currentSigner} />)} />
					<button className='menu__info-image-button'
						onClick={() => setSelectedBlock(Info)} />
				</div>
			</div>
			<div className='voting__grid-item'>
				{selectedBlock}
			</div>
		</div>
	);
};

export default Menu;