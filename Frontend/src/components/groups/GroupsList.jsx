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
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <div
          key={group.id}
          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div
            className="p-4 cursor-pointer"
            onClick={() => onGroupClick(group.id)}
          >
            <h3 className="font-bold text-lg text-gray-800 mb-2">
              {group.name}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {group.description}
            </p>

            <div className="flex items-center text-sm text-gray-500 mb-4">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{group.members?.length || 0} members</span>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
            {isUserMember(group) ? (
              <>
                <button
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLeaveGroup(group.id);
                  }}
                >
                  Leave Group
                </button>
                <div>
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditGroup(group);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          "Are you sure you want to delete this group?"
                        )
                      ) {
                        onDeleteGroup(group.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <button
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onJoinGroup(group.id);
                }}
              >
                Join Group
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupsList;
