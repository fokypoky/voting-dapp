import React from 'react';
import './voting-element.css';

const VotingElement = ({ contract }) => {
	return (
		<div className='voting-element'>
			<div className="voting-element-header">
				<button>Добавить лот</button>
				<button>Удалть голосование</button>
			</div>
			<div className="voting-element-body">
				<table>
					<thead>
					<tr>
						<td>#</td>
						<td>Лот</td>
						<td>Количество голосов</td>
					</tr>
					</thead>
				</table>
			</div>
		</div>
	);
};

export default VotingElement;