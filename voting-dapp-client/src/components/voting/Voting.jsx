import React, {useState} from 'react';
import './voting.css';
import Profile from "../profile/Profile";
import Search from "../search/Search";
import Home from "../home/Home";
import Info from "../info/Info";

const Voting = ({ provider, signer }) => {
	const [selectedBlock, setSelectedBlock] = useState(null);
	return (
		<div className='voting__grid'>
			<div className='voting__grid-menu'>
				<div className='menu__flex'>
					<button className='menu__home-image-button'
							onClick={() => setSelectedBlock(Home)}/>
					<button className='menu__profile-image-button'
							onClick={() => setSelectedBlock(Profile)}/>
					<button className='menu__search-image-button' onClick={() => setSelectedBlock(Search)}/>
					<button className='menu__info-image-button'
							onClick={() => setSelectedBlock(Info)}/>
				</div>
			</div>
			<div className='voting__grid-item'>
				{selectedBlock}
			</div>
		</div>
	);
};

export default Voting;