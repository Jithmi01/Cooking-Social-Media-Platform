import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import likeApi from '../../api/likeApi';
import { toast } from 'react-toastify';
import commentApi from '../../api/commentApi';

// Set the app element for accessibility
Modal.setAppElement('#root');

const PostFooter = ({ post }) => {
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [userLike, setUserLike] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [activeCommentMenu, setActiveCommentMenu] = useState(null);

  // Fetch likes and comments when post changes
  useEffect(() => {
    const fetchData = async () => {
      try {
       
        
        // Get comments
        const commentsData = await commentApi.getCommentsByPost(post.id);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };
    
    if (post && post.id) {
      fetchData();
    }
  }, [post]);

  const handleLikeToggle = async () => {
    try {
      setIsLoading(true);
     
    } catch (error) {
      console.error('Error toggling like status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    try {
      setIsLoading(true);
      
      if (editingComment) {
        // Update existing comment
        const updatedComment = await commentApi.updateComment(editingComment.id, commentText);
        setComments(prev => prev.map(c => c.id === editingComment.id ? updatedComment : c));
        setEditingComment(null);
        toast.success('Comment updated successfully!');
      } else {
        // Create new comment
        const newComment = await commentApi.createComment(post.id, commentText);
        setComments(prev => [...prev, newComment]);
        toast.success('Comment added successfully!');
      }
      
      setCommentText('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to submit comment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setCommentText(comment.comment);
    setIsModalOpen(true);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setIsLoading(true);
      await commentApi.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCommentText('');
    setEditingComment(null);
  };

  const toggleCommentMenu = (commentId) => {
    setActiveCommentMenu((prev) => (prev === commentId ? null : commentId));
  };

  return (
    <>
      <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button 
            className={`flex items-center space-x-1 ${isLiked ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
            onClick={handleLikeToggle}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>{likes.length || 0}</span>
          </button>
          
          <button 
            className="flex items-center space-x-1 text-gray-500 hover:text-green-600"
            onClick={() => setShowCommentInput((prev) => !prev)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{comments.length || 0}</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {likes.length > 0 && (
            <span>{likes.length} {likes.length === 1 ? 'person' : 'people'} liked this post</span>
          )}
        </div>
      </div>

      {/* Comment Input Area */}
      {showCommentInput && (
        <div className="p-4 border-t">
          <form onSubmit={handleCommentSubmit} className="flex space-x-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              disabled={isLoading || !commentText.trim()}
            >
              {editingComment ? 'Update' : 'Send'}
            </button>
          </form>

          {/* Comments List */}
          <div className="mt-4 space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded-lg relative">
                <div className="flex justify-between">
                  <div className="font-semibold">{comment.commentedBy?.name || 'Anonymous'}</div>
                </div>
                <p className="mt-1">{comment.comment}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(comment.commentedAt).toLocaleString()}
                </div>

                {/* Three-dot menu */}
                {comment.commentedBy.id === localStorage.getItem("userId") && (
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => toggleCommentMenu(comment.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v.01M12 12v.01M12 18v.01" />
                      </svg>
                    </button>
                    {activeCommentMenu === comment.id && (
                      <div className="absolute right-0 mt-2 w-24 bg-white border rounded-lg shadow-lg">
                        <button
                          onClick={() => handleEditComment(comment)}
                          className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Comments"
        className="max-w-lg w-[600px] mx-auto mt-20 bg-white rounded-lg shadow-xl overflow-hidden focus:ring-green-500"
        overlayClassName="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4"
      >
        <div className="flex flex-col h-full max-h-[80vh]">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Comments</h2>
            <button 
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="overflow-y-auto flex-grow p-4 space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <div className="font-semibold">{comment.commentedBy?.name || 'Anonymous'}</div>
                  </div>
                  <p className="mt-1">{comment.comment}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(comment.commentedAt).toLocaleString()}
                  </div>
                  
    
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t">
            <form onSubmit={handleCommentSubmit} className="flex space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                disabled={isLoading || !commentText.trim()}
              >
                {editingComment ? 'Update' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PostFooter;