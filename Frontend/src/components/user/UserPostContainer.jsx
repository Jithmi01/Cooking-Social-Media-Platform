import React from "react";
import UserPostMediaContainer from "./UserPostMediaContainer";

const UserPostContainer = ({ posts }) => {
  if (!posts?.length) {
    return (
      <div className="p-5 text-center text-gray-500">No posts available</div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-6 md:gap-8 w-[800px] max-w-4xl mx-auto">
      {posts.map((post) => (
        <div
          key={post.id}
          className="aspect-square bg-gray-100 relative overflow-hidden group"
        >
          <UserPostMediaContainer id={post.id} />
        </div>
      ))}
    </div>
  );
};

export default UserPostContainer;
