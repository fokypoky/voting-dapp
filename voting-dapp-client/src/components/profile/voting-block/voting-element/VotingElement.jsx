import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import './voting-element.css';

const VotingElement = ({ contract }) => {
	const [lots, setLots] = useState([]);
	const [lotComponents, setLotComponents] = useState(null);

	const addLot = async () => {
		const lotTitle = window.prompt('Название кандидата');

		try {
			const isLotExists = await contract.contract.isLotExists(lotTitle);

			if(isLotExists) {
				toast.error('Кандидат с таким названием уже существует');
				return;
			}

			await contract.contract.addLot(lotTitle);

			toast.info('Дождитесь подтверждения транзакции', { autoClose: 20000});
			setTimeout(() => {
				const _lots = Array.from(lots);

				_lots.push({
					title: lotTitle,
					votesCount: 0
				});

				setLots(_lots);
			}, 20000);
		} catch (e) {
			toast.error('Возникла ошибка во время работы с сетью блокчейн');
			console.error(e);
		}
	}

	const deleteLot = async (lot) => {
		if (lot.votesCount > 0) {
			toast.error('Вы не можете удалить кандадата, т.к. его количество голосов больше 0');
			return;
		}

		try {
			await contract.contract.removeLot(lot.title);
			toast.info('Дождитесь подтверждения транзакции', { autoClose: 20000 });
			setTimeout(() => {
				const _lots = Array.from(lots);
				_lots.splice(_lots.indexOf(lot), 1);
				setLots(_lots);
			}, 20000);
		} catch (e) {
			toast.error('Ошибка выполнения транзакции');
			console.error(e);
		}
	}

	const changeVotingStatus = async () => {
		try {
			const status = await contract.contract.getIsActive();
			await contract.contract.setIsActive(!status);
			toast.info('Дождитесь подтверждения транзакции', { autoClose: 20000});
		} catch (e) {
			toast.error('Возникла ошибка во время работы с сетью блокчейн');
			console.error(e);
		}
	}

	useEffect(() => {
		if(lots.length > 0) {
			setLotComponents(
				<table className='voting-element-lots-table'>
					<thead>
					<tr>
						<th>№</th>
						<th>Название</th>
						<th>Количество голосов</th>
						<th>Удаление</th>
					</tr>
					</thead>
					<tbody>
					{lots.map((lot, index) => {
						return (
							<tr>
								<td>
									<div className='voting-element-lots-table-item'>{index + 1}</div>
								</td>
								<td>
									<div className='voting-element-lots-table-item'>{lot.title}</div>
								</td>
								<td>
									<div className='voting-element-lots-table-item'>{lot.votesCount}</div>
								</td>
								<td>
									<div className='voting-element-lots-table-item'>
										<button className='voting-element-lots-table-rm-button'
											onClick={() => deleteLot(lot)}>
											Удалить
										</button>
									</div>
								</td>
							</tr>
						);
					})}
					</tbody>
				</table>
			);
		} else {
			setLotComponents(
				<div className='voting-element-empty-lots-block'>
					Список кандидатов пуст
				</div>
			);
		}
	}, [lots]);

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

	return (
		<div className="voting-element">
			<div className="voting-element-header">
				<div className="voting-element-header-button">
					<button className="voting-element-header-add-lot-button voting-element-action-button"
					onClick={() => addLot()}>Добавить кандидата
					</button>
				</div>
				<div className="voting-element-header-button">
					<button className="voting-element-header-add-lot-button voting-element-action-button"
					onClick={() => changeVotingStatus()}>Закрыть/открыть голосование
					</button>
				</div>
			</div>
			<div className="voting-element-body">
				{lotComponents}
			</div>
			<ToastContainer
				position="bottom-right"
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