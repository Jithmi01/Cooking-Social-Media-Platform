import React, { useEffect, useState } from "react";
import taskCompletionApi from "../../api/taskCompletionApi";
import { Shield, Award, Star, Zap } from "lucide-react";

const UserBadge = () => {
  const userId = localStorage.getItem("userId");
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskCompletionApi
      .getCompletionsByUser(userId)
      .then((result) => {
        setCompletions(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  const getBadgeInfo = () => {
    const count = completions.length;

    if (count === 0) {
      return null;
    } else if (count >= 1 && count <= 5) {
      return {
        name: "Silver",
        icon: <Shield className="mr-1" size={18} />,
        bgColor: "bg-gray-200",
        textColor: "text-gray-700",
        borderColor: "border-gray-300",
      };
    } else if (count >= 6 && count <= 10) {
      return {
        name: "Gold",
        icon: <Award className="mr-1" size={18} />,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-300",
      };
    } else if (count >= 11 && count <= 20) {
      return {
        name: "Platinum",
        icon: <Star className="mr-1" size={18} />,
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
        borderColor: "border-blue-300",
      };
    } else {
      return {
        name: "Vibranium",
        icon: <Zap className="mr-1" size={18} />,
        bgColor: "bg-purple-100",
        textColor: "text-purple-700",
        borderColor: "border-purple-300",
      };
    }
  };

  if (loading) {
    return <div className="animate-pulse w-24 h-6 bg-gray-200 rounded"></div>;
  }

  const badgeInfo = getBadgeInfo();

  if (!badgeInfo) {
    return null;
  }

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeInfo.bgColor} ${badgeInfo.textColor} border ${badgeInfo.borderColor} shadow-sm`}
    >
      {badgeInfo.icon}
      <span>{badgeInfo.name}</span>
      <span className="ml-1 px-1.5 py-0.5 bg-white rounded-full text-xs font-semibold">
        {completions.length}
      </span>
    </div>
  );
};

export default UserBadge;
