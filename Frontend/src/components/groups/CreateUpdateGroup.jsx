import React, { useState, useEffect } from "react";

const CreateUpdateGroup = ({ group, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    memberIds: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // If editing, populate form with group data
  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || "",
        description: group.description || "",
        memberIds: group.members?.map((member) => member.id) || [],
      });
    }
  }, [group]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Group name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Group description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (group) {
        await onSubmit(group.id, formData);
      } else {
        await onSubmit(formData);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
   <div>
    
   </div>
  );
};

export default CreateUpdateGroup;
