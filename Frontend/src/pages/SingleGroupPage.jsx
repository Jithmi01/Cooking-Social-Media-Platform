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
}