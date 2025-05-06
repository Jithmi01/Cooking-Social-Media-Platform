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

  

  return (
    <div className="container mx-auto p-4">
      
    </div>
  );
};

export default GroupsPage;
