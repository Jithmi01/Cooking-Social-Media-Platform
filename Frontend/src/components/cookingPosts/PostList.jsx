import React, { useState } from "react";
import cookingPostApi from "../../api/cookingPostApi";
import { toast } from "react-toastify";
import Modal from "react-modal";
import MediaContainer from "./MediaContainer";
import PostFooter from "./PostFooter";
import EditPostModal from "./EditPostModal";
import { Link } from "react-router-dom";

// Set app element for modal accessibility
Modal.setAppElement("#root");

const PostList = ({ posts, onUpdateOrDelete, onSubmitSuccess }) => {
  const userId = localStorage.getItem("userId");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await cookingPostApi.deletePost(postId);
        toast.success("Post deleted successfully");
        onUpdateOrDelete(); // Refresh the list
      } catch (error) {
        toast.error("Failed to delete post");
        console.error(error);
      }
    }
  };

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <p className="mt-4 text-lg text-gray-600">No posts available</p>
        <p className="text-gray-500">Be the first to share a cooking post!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* Post Header */}
          <div className="p-4 flex justify-between items-center">
            <Link
              to={
                localStorage.getItem("userId") === post.createdBy.id
                  ? "/profile"
                  : `user-profile/${post.createdBy.id}`
              }
            >
              <div className="flex items-center space-x-3">
                <img
                  src={
                    "https://img.freepik.com/free-vector/green-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"
                  }
                  alt={post.createdBy?.name || "User"}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {post.createdBy?.name || "Anonymous"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {post.createdAt
                      ? new Date(post.createdAt).toDateString()
                      : "Recently"}
                  </p>
                </div>
              </div>
            </Link>

            {post.createdBy.id === userId && (
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                  <div className="py-1">
                    <button
                      onClick={() => handleEditClick(post)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="px-4 pb-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {post.title}
            </h2>
            <p className="text-gray-700 mb-4 whitespace-pre-line">
              {post.description}
            </p>
          </div>

          {/* Media Container */}
          <MediaContainer post={post} />

          {/* Post Footer */}
          <PostFooter post={post} />
        </div>
      ))}

      {/* Edit Post Modal */}
      {selectedPost && (
        <EditPostModal
          isOpen={isModalOpen}
          onClose={closeModal}
          id={selectedPost.id}
          onSubmitSuccess={onSubmitSuccess}
        />
      )}
    </div>
  );
};

export default PostList;
