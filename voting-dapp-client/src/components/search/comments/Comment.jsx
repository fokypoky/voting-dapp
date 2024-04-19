import React from 'react';
import './comment.css';

const Comment = ({comment, isOwner}) => {
	return (
		<div className='comment'>
			<div className='comment-header'>
				{
					isOwner
					? <div className='comment-header-owner-address'>{comment.address}</div>
					: <div className='comment-header-user-address'>{comment.address}</div>
				}
				<div className='comment-header-date'>в {comment.date}</div>
			</div>
			<div>
				{comment.text}
			</div>
		</div>
	)
};

export default Comment;