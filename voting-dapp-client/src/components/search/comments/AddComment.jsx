import React, {useState} from 'react';
import './add-comment.css';
import { ToastContainer, toast } from 'react-toastify';

const AddComment = ({ contract }) => {
  const [commentText, setCommentText] = useState('');
  
  const addComment = async () => {
    try {
      if (!commentText) {
        toast.error('Введите текст комментария');
        return;
      }
      
      await contract.addComment(commentText);
      
      toast.info('Дождитесь добавления транзакции в сеть блокчейн', {autoClose: 20000});
    } catch(e) {
      toast.error('Ошибка выполнения запроса');
      console.error(e);
    }
  }
  
  return (
    <div className='comment-block-add-comment'>
      <button className='add-comment-button' onClick={() => addComment()}>
        Добавить
      </button>
      <input placeholder='Комментарий...' className='add-comment-input'
        type='text'
        value={commentText}
        onChange={e => setCommentText(e?.target.value)}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            addComment();
          }
        }}/>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
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
  )
};

export default AddComment;