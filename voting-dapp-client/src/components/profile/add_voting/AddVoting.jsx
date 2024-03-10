import React, {useState} from "react";
import './add-voting.css';

const AddVoting = () => {
	const [votingTitle, setVotingTitle] = useState('');
	return (
		<div className='add-voting-block'>
			<div>Название: </div>
			<div>
				<input type='text' value={votingTitle}
							 onChange={e => setVotingTitle(e.target.value)}
							 className='add-voting-input'/>
			</div>
			<div>
				<button className='add-voting-button'>Добавить</button>
			</div>
		</div>
	);
}

export default AddVoting;