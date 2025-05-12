import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CreateUpdatePostModal from "../components/cookingPosts/CreateUpdatePostModal";
import cookingPostApi from "../api/cookingPostApi";
import PostList from "../components/cookingPosts/PostList";

const CookingPostsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = (await cookingPostApi.getAllPosts()).reverse();
      setPosts(data);
    } catch (error) {
      toast.error("Failed to fetch posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setPostToEdit(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePostSubmitSuccess = () => {
    fetchPosts();
    closeModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container w-[800px] mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Cooking Posts</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Create New Post
        </button>
      </div>

      <PostList
        posts={posts ?? []}
        onUpdateOrDelete={fetchPosts}
        onSubmitSuccess={handlePostSubmitSuccess}
      />

      <CreateUpdatePostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialPost={postToEdit}
        onSubmitSuccess={handlePostSubmitSuccess}
      />
    </div>
  );
};

export default CookingPostsPage;
