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
      <h1 className="text-2xl font-bold mb-6">Groups</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search groups..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <span className="absolute right-3 top-2.5">🔍</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              !showMyGroups ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setShowMyGroups(false)}
          >
            All Groups
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              showMyGroups ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => {
              setShowMyGroups(true);
              setFilteredGroups(myGroups);
            }}
          >
            My Groups
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              setEditingGroup(null);
              setIsCreating(true);
            }}
          >
            Create Group
          </button>
        </div>
      </div>

      {isCreating ? (
        <CreateUpdateGroup
          group={editingGroup}
          onSubmit={editingGroup ? handleUpdateGroup : handleCreateGroup}
          onCancel={() => {
            setIsCreating(false);
            setEditingGroup(null);
          }}
        />
      ) : (
        <GroupsList
          groups={filteredGroups}
          loading={loading}
          isMyGroups={showMyGroups}
          onGroupClick={handleGroupClick}
          onJoinGroup={handleJoinGroup}
          onLeaveGroup={handleLeaveGroup}
          onEditGroup={handleEditGroup}
          onDeleteGroup={handleDeleteGroup}
        />
      )}
    </div>
  );
};

export default GroupsPage;
