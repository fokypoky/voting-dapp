import React from "react";
import './voting-block.css';

const VotingBlock = ({ contract, setSelectedBlock }) => {
	return (
		<div>
			{contract.title}
		</div>
	)
}

export default VotingBlock;