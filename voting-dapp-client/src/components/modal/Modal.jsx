import React from 'react';
import './modal.css';

const Modal = ({ header, body }) => {
	return (
		<div className='modal'>
			<div className="model__content">
				<div className="modal__header"></div>
				<div className="modal__body"></div>
				<div className="modal__footer"></div>
			</div>
		</div>
	);
};

export default Modal;