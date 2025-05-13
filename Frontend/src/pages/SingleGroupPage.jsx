import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import groupApi from "../api/groupApi";
import groupPostApi from "../api/groupPostApi";
import Modal from "react-modal";
import { uploadFile } from "../services/uploadFileService";

// Modal styles
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "600px",
    width: "90%",
    borderRadius: "8px",
    padding: "0",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
};
Modal.setAppElement("#root");

const SingleGroupPage = () => {
  const { id } = useParams();

  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mediaUrl: "",
    groupId: id,
  });

  // Fetch group and posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [groupData, postsData, myGroups] = await Promise.all([
          groupApi.getGroupById(id),
          groupPostApi.getPostsByGroupId(id),
          groupApi.getMyGroups(),
        ]);
        if (myGroups) {
          console.log("user has groups");
          const userGroup = myGroups.find((group) => group.id === id);
          console.log(`user gruo[ ${userGroup}]`);
          if (userGroup) {
            setIsMember(true);
          }
        }
        setGroup(groupData);
        setPosts(postsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load group data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  // Upload file to Firebase
  const uploadFileCall = async () => {
    if (!file) return null;

    try {
      const downloadUrl = await uploadFile(
        file,
        `group-posts/${Date.now()}_${file.name}`,
        (progress) => {
          setUploadProgress(Math.round((progress * 100) / 100));
        }
      );
      return downloadUrl;
    } catch (err) {
      console.error("Error uploading file:", err);
      throw err;
    }
  };
// Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

    // Open modal for creating new post

  const openCreateModal = () => {
    setCurrentPost(null);
    setFormData({
      title: "",
      description: "",
      mediaUrl: "",
      groupId: id,
    });
    setFile(null);
    setUploadProgress(0);
    setIsModalOpen(true);
  };

  // Open modal for editing post
  const openEditModal = (post) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      description: post.description,
      mediaUrl: post.mediaUrl,
      groupId: id,
    });
    setIsModalOpen(true);
  };

  // Close all modals
  const closeModal = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
  };


  // Submit post (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let mediaUrl = formData.mediaUrl;

      // Upload new file if selected
      if (file) {
        mediaUrl = await uploadFileCall();
      }

      const postData = {
        ...formData,
        mediaUrl,
      };
      if (currentPost) {
        // Update existing post
        await groupPostApi.updateGroupPost(currentPost.id, postData);
        setPosts(
          posts.map((p) =>
            p.id === currentPost.id ? { ...p, ...postData } : p
          )
        );
      } else {
        // Create new post
        const newPost = await groupPostApi.createGroupPost(postData);
        setPosts([newPost, ...posts]);
      }

      closeModal();
    } catch (err) {
      console.error("Error saving post:", err);
      alert("Failed to save post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Confirm delete post
  const confirmDelete = (post) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

    // Delete post
  const handleDelete = async () => {
    try {
      setLoading(true);
      await groupPostApi.deleteGroupPost(postToDelete.id);
      setPosts(posts.filter((p) => p.id !== postToDelete.id));
      closeModal();
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !group) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!group) {
    return <div>Group not found</div>;
  }
return (
    <div className="container w-[800px] mx-auto px-4 py-8">
      {/* Group Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{group.name}</h1>
        <p className="text-gray-600 mb-4">{group.description}</p>

        <div className="flex items-center mb-4">
          <svg
            className="w-5 h-5 text-gray-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="text-gray-700">{group.members.length} members</span>
        </div>

        {isMember && (
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Create Post
          </button>
        )}
      </div>

      {/* Members Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Members</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {group.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600">{member.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {member.name}
                </p>
                {member.username && (
                  <p className="text-xs text-gray-500">@{member.username}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-6 ">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Posts</h2>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">
              No posts yet. Be the first to share something!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white max-h-[800px] rounded-lg shadow-md overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600">
                        {post.postedBy?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {post.postedBy?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {post.postedBy?.id === localStorage.getItem("userId") && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(post)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(post)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-700 mb-4">{post.description}</p>

                {post.mediaUrl && (
                  <div className="mb-4">
                    <img
                      src={post.mediaUrl}
                      alt={post.title}
                      className="w-full h-[400px] object-contain rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/600x400?text=Image+Not+Available";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Post Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={currentPost ? "Edit Post" : "Create Post"}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {currentPost ? "Edit Post" : "Create New Post"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="media"
              >
                Media (Image)
              </label>
              <input
                type="file"
                id="media"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              {formData.mediaUrl && !file && (
                <div className="mt-2">
                  <img
                    src={formData.mediaUrl}
                    alt="Current media"
                    className="h-20 w-auto"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {currentPost ? "Updating..." : "Creating..."}
                  </span>
                ) : currentPost ? (
                  "Update Post"
                ) : (
                  "Create Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Delete Post Confirmation"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Delete Post</h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SingleGroupPage;
