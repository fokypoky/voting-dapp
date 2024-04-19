import React, {useEffect, useState} from 'react';
import AddComment from "./AddComment";
import './comment-block.css';
import Comment from "./Comment";

const CommentsBlock = ({contract}) => {
	const [comments, setComments] = useState([]);
	const [ownerAddress, setOwnerAddress] = useState(null);
	const getComments = async () => {
		const rawComments = await contract.getAllComments();
		return rawComments.map(rawComment => {
			return {
				address: rawComment[0],
				text: rawComment[1],
				date: convertUNIXTimestampToDateString(parseInt(rawComment[2]))
			}
		});
	}

	const refreshComments = async () => {
		const _comments = await getComments();
		setComments(_comments.reverse());
	}

	const convertUNIXTimestampToDateString = (timestamp) => {
		const getDoubleDateValue = (value) => {
			const strValue = String(value);
			return strValue.length > 1 ? strValue : `0${strValue}`;
		}
		const date = new Date(timestamp * 1000);
		return `${getDoubleDateValue(date.getHours())}:${getDoubleDateValue(date.getMinutes())}:${getDoubleDateValue(date.getSeconds())} ${getDoubleDateValue(date.getDay())}.${getDoubleDateValue(date.getMonth())}.${getDoubleDateValue(date.getFullYear())}`;
	}

	useEffect(() => {
		const init = async () => {
			const _ownerAddress = await contract.owner();
			setOwnerAddress(_ownerAddress);

			const _comments = await getComments();
			setComments(_comments.reverse());
		}

		init();
	}, []);

	return (
		<div className='comment-block'>
			<div className='comment-block-header'>
				Комментарии
				<button className='refresh-comments-button'
								onClick={() => refreshComments()}/>
			</div>
			<AddComment contract={contract}/>
			<div className='comments-body'>
				{
					comments.length === 0
						? <div className='empty-comments'>Оставьте первый комментарий</div>
						: comments.map(comment => <Comment comment={comment} isOwner={comment.address === ownerAddress}/>)
				}
			</div>
		</div>
	);
};

export default CommentsBlock;