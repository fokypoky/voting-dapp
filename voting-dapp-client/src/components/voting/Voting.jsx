import React, { useState } from 'react';
import Home from "../home/Home";
import Info from "../info/Info";
import Profile from "../profile/Profile";
import Search from "../search/Search";
import './voting.css';
import Settings from '../settings/Settings';

const Voting = ({ provider, signer }) => {
	const [selectedBlock, setSelectedBlock] = useState(null);

	return (
		<div className='voting__grid'>
			<div className='voting__grid-menu'>
				<div className='menu__flex'>
					<button className='menu__home-image-button'
						onClick={() => setSelectedBlock(<Home />)} />
					<button className='menu__profile-image-button'
						onClick={() => setSelectedBlock(<Profile signer={signer} provider={provider}
							setSelectedBlock={setSelectedBlock} />)} />
					<button className='menu__search-image-button' onClick={() => setSelectedBlock(
						<Search signer={signer} />)} />
					<button className='menu__info-image-button'
						onClick={() => setSelectedBlock(Info)} />
					<button className='menu__settings-image-button'
						onClick={() => setSelectedBlock(<Settings />)} />
				</div>
			</div>
			<div className='voting__grid-item'>
				{selectedBlock}
			</div>
		</div>
	);
};

export default Voting;