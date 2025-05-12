import React from "react";

const GroupsList = ({
  groups,
  loading,
  isMyGroups,
  onGroupClick,
  onJoinGroup,
  onLeaveGroup,
  onEditGroup,
  onDeleteGroup,
}) => {
  // Get userId from localStorage for checking membership
  const currentUserId = localStorage.getItem("userId");

  // Helper to check if current user is a member
  const isUserMember = (group) => {
    return group.members?.some((member) => member.id === currentUserId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-500">
          {isMyGroups
            ? "You're not a member of any groups yet."
            : "No groups found."}
        </h3>
        {!isMyGroups && (
          <p className="mt-2 text-gray-400">
            Create a new group or join existing ones.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      
    </div>
  );
};

export default GroupsList;
