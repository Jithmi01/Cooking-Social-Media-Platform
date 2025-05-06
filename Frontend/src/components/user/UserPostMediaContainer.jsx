import React, { useEffect, useState } from "react";
import mediaApi from "../../api/mediaApi";

const UserPostMediaContainer = ({ id }) => {
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mediaApi
      .getMediaByPostId(id)
      .then((mediaData) => {
        setMedia(mediaData[0]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        Media not available
      </div>
    );
  }

  return media.type === "image" ? (
    <img
      src={media.url}
      alt={media.description || "Post image"}
      className="w-full h-full object-cover"
    />
  ) : media.type === "video" ? (
    <video controls className="w-full h-full object-cover">
      <source src={media.url} type="video/mp4" />
    </video>
  ) : (
    <div className="w-full h-full flex items-center justify-center text-gray-400">
      Unsupported media type
    </div>
  );
};

export default UserPostMediaContainer;
