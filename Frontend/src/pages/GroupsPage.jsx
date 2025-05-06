import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroupsList from "../components/groups/GroupsList";
import CreateUpdateGroup from "../components/groups/CreateUpdateGroup";
import groupApi from "../api/groupApi";

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMyGroups, setShowMyGroups] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const navigate = useNavigate();

  // Fetch all groups and my groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const [allGroupsData, myGroupsData] = await Promise.all([
          groupApi.getAllGroups(),
          groupApi.getMyGroups(),
        ]);

        setGroups(allGroupsData);
        setFilteredGroups(allGroupsData);
        setMyGroups(myGroupsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Failed to load groups. Please try again later.");
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Handle search and filter
  useEffect(() => {
    const groupsToFilter = showMyGroups ? myGroups : groups;

    if (searchTerm.trim() === "") {
      setFilteredGroups(groupsToFilter);
    } else {
      const filtered = groupsToFilter.filter(
        (group) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGroups(filtered);
    }
  }, [searchTerm, showMyGroups, groups, myGroups]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateGroup = async (groupData) => {
    try {
      setLoading(true);
      const newGroup = await groupApi.createGroup(groupData);

      // Update both lists
      setGroups((prev) => [...prev, newGroup]);
      setMyGroups((prev) => [...prev, newGroup]);

      setIsCreating(false);
      setLoading(false);
    } catch (err) {
      console.error("Error creating group:", err);
      setError("Failed to create group. Please try again.");
      setLoading(false);
    }
  };

  const handleUpdateGroup = async (groupId, groupData) => {
    try {
      setLoading(true);
      const updatedGroup = await groupApi.updateGroup(groupId, groupData);

      // Update in both lists
      setGroups((prev) =>
        prev.map((group) => (group.id === groupId ? updatedGroup : group))
      );
      setMyGroups((prev) =>
        prev.map((group) => (group.id === groupId ? updatedGroup : group))
      );

      setEditingGroup(null);
      setLoading(false);
    } catch (err) {
      console.error("Error updating group:", err);
      setError("Failed to update group. Please try again.");
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      setLoading(true);
      const success = await groupApi.deleteGroup(groupId);

      if (success) {
        // Remove from both lists
        setGroups((prev) => prev.filter((group) => group.id !== groupId));
        setMyGroups((prev) => prev.filter((group) => group.id !== groupId));
      }

      setLoading(false);
    } catch (err) {
      console.error("Error deleting group:", err);
      setError("Failed to delete group. Please try again.");
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      setLoading(true);
      const updatedGroup = await groupApi.joinGroup(groupId);

      // Update groups and add to my groups
      setGroups((prev) =>
        prev.map((group) => (group.id === groupId ? updatedGroup : group))
      );
      setMyGroups((prev) => [...prev, updatedGroup]);

      setLoading(false);
    } catch (err) {
      console.error("Error joining group:", err);
      setError("Failed to join group. Please try again.");
      setLoading(false);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      setLoading(true);
      const updatedGroup = await groupApi.leaveGroup(groupId);

      // Update groups and remove from my groups
      setGroups((prev) =>
        prev.map((group) => (group.id === groupId ? updatedGroup : group))
      );
      setMyGroups((prev) => prev.filter((group) => group.id !== groupId));

      setLoading(false);
    } catch (err) {
      console.error("Error leaving group:", err);
      setError("Failed to leave group. Please try again.");
      setLoading(false);
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setIsCreating(true);
  };

  return (
    <div className="container mx-auto p-4">
      
    </div>
  );
};

export default GroupsPage;
