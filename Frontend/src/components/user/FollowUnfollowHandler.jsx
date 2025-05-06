import React, { useState, useEffect } from "react";
import followApi from "../../api/followApi";

const FollowUnfollowHandler = ({
  userId,
  initialFollowersCount = 0,
  initialFollowingCount = 0,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollower, setIsFollower] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [followingCount, setFollowingCount] = useState(initialFollowingCount);

  useEffect(() => {
    // Check if current user is following this user
    const checkFollowStatus = async () => {
      try {
        setIsLoading(true);
        const status = await followApi.checkFollowStatus(userId);
        setIsFollowing(status.following);
        setIsFollower(status.follower);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking follow status:", error);
        setIsLoading(false);
      }
    };

    if (userId) {
      checkFollowStatus();
    }
  }, [userId]);

  const handleFollow = async () => {
    try {
      setIsLoading(true);
      await followApi.followUser(userId);
      setIsFollowing(true);
      setFollowersCount((prevCount) => prevCount + 1);
      setIsLoading(false);
    } catch (error) {
      console.error("Error following user:", error);
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setIsLoading(true);
      await followApi.unfollowUser(userId);
      setIsFollowing(false);
      setFollowersCount((prevCount) => Math.max(0, prevCount - 1));
      setIsLoading(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
      setIsLoading(false);
    }
  };

  // Determine if this is the current logged-in user
  const currentUserId = localStorage.getItem("userId");
  const isCurrentUser = currentUserId === userId;

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
      {/* Follow stats */}
      <div className="flex justify-center space-x-6 mb-4 w-full">
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-gray-800">
            {followersCount}
          </span>
          <span className="text-sm text-gray-600">Followers</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-gray-800">
            {followingCount}
          </span>
          <span className="text-sm text-gray-600">Following</span>
        </div>
      </div>

      {/* Follow/Unfollow button */}
      {!isCurrentUser && (
        <div className="w-full">
          {isLoading ? (
            <button
              className="w-full py-2 px-4 bg-gray-300 text-gray-500 rounded-md font-medium cursor-not-allowed"
              disabled
            >
              Loading...
            </button>
          ) : isFollowing ? (
            <button
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-md font-medium transition-colors"
              onClick={handleUnfollow}
            >
              Unfollow
            </button>
          ) : (
            <button
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors"
              onClick={handleFollow}
            >
              Follow
            </button>
          )}
        </div>
      )}

      {/* Optional: Show if this user follows you */}
      {!isCurrentUser && isFollower && (
        <div className="mt-2 text-xs text-gray-500 font-medium">
          <span>Follows you</span>
        </div>
      )}
    </div>
  );
};

export default FollowUnfollowHandler;
