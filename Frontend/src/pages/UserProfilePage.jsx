import React, { useEffect, useState } from "react";
import userApi from "../api/userApi";
import followApi from "../api/followApi";
import { useParams, Link } from "react-router-dom";
import FollowUnfollowHandler from "../components/user/FollowUnfollowHandler";
import cookingPostApi from "../api/cookingPostApi";
import UserPostContainer from "../components/user/UserPostContainer";

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFolliwng] = useState(false);

  useEffect(() => {
    followApi
      .checkFollowStatus(id)
      .then((resul) => setIsFolliwng(resul.follower))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await userApi.getUserById(id);
        setUser(userData);

        // Fetch user posts if there's an endpoint for that
        const userPosts = await cookingPostApi.getPostsByUser(id);
        setPosts(userPosts);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const fetchFollowers = async () => {
    try {
      const data = await followApi.getFollowers(id);
      setFollowers(data.users);
    } catch (err) {
      console.error("Error fetching followers:", err);
    }
  };

  const fetchFollowing = async () => {
    try {
      const data = await followApi.getFollowing(id);
      setFollowing(data.users);
    } catch (err) {
      console.error("Error fetching following:", err);
    }
  };

  // Tab switching handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === "followers" && followers.length === 0) {
      fetchFollowers();
    } else if (tab === "following" && following.length === 0) {
      fetchFollowing();
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">User not found</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* User header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
        {/* Profile image */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-300 rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-8">
          <img
            src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* User info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center mb-4">
            <h1 className="text-2xl font-semibold mb-2 sm:mb-0 sm:mr-4">
              {user.username}
            </h1>
            <div className="sm:ml-auto">
              <FollowUnfollowHandler
                userId={id}
                initialFollowersCount={user.followersCount || 0}
                initialFollowingCount={user.followingCount || 0}
              />
            </div>
          </div>

          <div className="mb-4">
            <h2 className="font-medium">{user.name}</h2>
            {user.badge && (
              <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                {user.badge}
              </div>
            )}
            <p className="text-gray-600 mt-2">
              {user.bio || "Cooking enthusiast and food lover."}
            </p>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-t border-gray-200">
        <div className="flex justify-around">
          <button
            className={`py-3 px-4 ${
              activeTab === "posts"
                ? "border-t-2 border-black font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("posts")}
          >
            Posts
          </button>
          <button
            className={`py-3 px-4 ${
              activeTab === "followers"
                ? "border-t-2 border-black font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("followers")}
          >
            Followers
          </button>
          <button
            className={`py-3 px-4 ${
              activeTab === "following"
                ? "border-t-2 border-black font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("following")}
          >
            Following
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {/* Posts grid */}
        {activeTab === "posts" && !isFollowing && <p>Account is private</p>}
        {activeTab === "posts" && isFollowing && (
          <div className="grid grid-cols-3 gap-1">
            {posts.length === 0 ? (
              <p>No Posts</p>
            ) : (
              <UserPostContainer posts={posts} />
            )}
          </div>
        )}

        {/* Followers list */}
        {activeTab === "followers" && (
          <div className="mt-2">
            {followers.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No Followers Yet</p>
            ) : (
              <div className="space-y-4">
                {followers.map((follower) => (
                  <Link
                    to={`/users/${follower.id}`}
                    key={follower.id}
                    className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${follower.name}&background=random`}
                        alt={follower.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{follower.username}</p>
                      <p className="text-gray-500 text-sm">{follower.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Following list */}
        {activeTab === "following" && (
          <div className="mt-2">
            {following.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No Followers Yet</p>
            ) : (
              <div className="space-y-4">
                {following.map((followedUser) => (
                  <Link
                    to={`/users/${followedUser.id}`}
                    key={followedUser.id}
                    className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${followedUser.name}&background=random`}
                        alt={followedUser.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{followedUser.username}</p>
                      <p className="text-gray-500 text-sm">
                        {followedUser.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
