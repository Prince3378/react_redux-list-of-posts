import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';

import { Post } from '../types/Post';
import {
  useDeleteCommentMutation,
  useGetCommentsQuery,
} from '../api/generalApi';

type Props = {
  post: Post;
};

export const PostDetails: React.FC<Props> = ({ post }) => {
  const [visible, setVisible] = useState(false);

  const {
    data: comments = [],
    isLoading,
    isError,
  } = useGetCommentsQuery(post.id);

  const [deleteComment] = useDeleteCommentMutation();

  const deleteItem = async (id: number) => {
    await deleteComment(id);
  };

  return (
    <div className="content">
      <div className="block">
        <h2>
          {`#${post.id}: ${post.title}`}
        </h2>
        <p>{post.body}</p>
      </div>

      <div className="block">
        {isLoading && <Loader />}

        {!isLoading && isError && (
          <div className="notification is-danger">
            Something went wrong
          </div>
        )}

        {!isLoading && !isError && comments.length === 0 && (
          <p className="title is-4">No comments yet</p>
        )}

        {!isLoading && !isError && comments.length > 0 && (
          <>
            <p className="title is-4">Comments:</p>

            {comments.map(comment => (
              <article className="message is-small" key={comment.id}>
                <div className="message-header">
                  <a href={`mailto:${comment.email}`}>
                    {comment.name}
                  </a>

                  <button
                    type="button"
                    className="delete is-small"
                    aria-label="delete"
                    onClick={() => deleteItem(comment.id)}
                  >
                    delete button
                  </button>
                </div>

                <div className="message-body">
                  {comment.body}
                </div>
              </article>
            ))}
          </>
        )}

        {!isLoading && !isError && !visible && (
          <button
            type="button"
            className="button is-link"
            onClick={() => setVisible(true)}
          >
            Write a comment
          </button>
        )}

        {!isLoading && !isError && visible && (
          <NewCommentForm postId={post.id} setVisible={setVisible} />
        )}
      </div>
    </div>
  );
};