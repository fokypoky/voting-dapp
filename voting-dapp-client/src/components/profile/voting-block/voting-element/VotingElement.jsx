import React, {useEffect, useState} from 'react';
import { ToastContainer, toast } from "react-toastify";
import './voting-element.css';

const VotingElement = ({ contract }) => {
	const [lots, setLots] = useState([]);
	const [lotComponents, setLotComponents] = useState(null);

	const deleteLot = async (lot) => {
		console.log(lot.title);
	}

	useEffect(() => {
		const init = async () => {
			try {
				const lotsTitles = await contract.contract.getAllLotsTitles();
				const lots = [];

				for(const lotTitle of lotsTitles) {
					if(!lotTitle) {
						continue;
					}

					const lotVotesCount = await contract.contract.getLotVotes(lotTitle);
					lots.push({
						title: lotTitle,
						votesCount: parseInt(lotVotesCount)
					});
				}

				setLots(lots);
			} catch(e) {
				console.error(e);
				toast.error('Ошибка подключения к сети блокчейн');
			}
		}

		init();
	}, []);

	useEffect(() => {
		if(lots.length > 0) {
			setLotComponents(
				<div className="voting-table-container">
					<table className="voting-table">
						<thead>
						<tr>
							<th>№</th>
							<th>Название</th>
							<th>Количество голосов</th>
							<th>Действие</th>
						</tr>
						</thead>
						<tbody>
						{lots.map((lot, index) => {
							return(<tr>
								<td>{index + 1}</td>
								<td>{lot.title}</td>
								<td>{lot.votesCount}</td>
								<td>
									<button onClick={() => deleteLot(lot)}
													className="voting-table-rm-lot-button">
										Удалить
									</button>
								</td>
							</tr>);
						})}
						</tbody>
					</table>
				</div>
			)
		} else {
			setLotComponents(
				<div className='voting-element-empty-lots-block'>
					Список кандидатов пуст
				</div>
			);
		}
	}, [lots]);

	return (
		<div className="voting-element">
			<div className="voting-element-header">
				<div className="voting-element-header-button">
					<button className="voting-element-header-add-lot-button voting-element-action-button">Добавить кандидата
					</button>
				</div>
				<div className="voting-element-header-button">
					<button className="voting-element-header-rm-voting-button voting-element-action-button">Удалить голосование
					</button>
				</div>
			</div>
			<div className="voting-element-body">
				{lotComponents}
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

export default VotingElement;