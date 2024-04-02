import React from "react";
import Profile from "../Profile";
import './voting-block.css';
import VotingElement from "./voting-element/VotingElement";

const VotingBlock = ({ contract, setSelectedBlock, signer, provider }) => {
	return (
		<div className='voting-block'>
			<div className="voting-block-header">
				<div className='voting-block-header-back'>
					<button className='voting-block-header-back-button' onClick={() => setSelectedBlock(
						<Profile signer={signer} provider={provider}
										setSelectedBlock={setSelectedBlock}/>)
					}/>
				</div>
				<div className='voting-block-header-title'>
					{contract.title}
				</div>
			</div>
			<div className='voting-block-body'>
				<VotingElement contract={contract}/>
			</div>
		</div>
	)
}

export default VotingBlock;