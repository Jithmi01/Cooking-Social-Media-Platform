import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import groupApi from "../api/groupApi";
import groupPostApi from "../api/groupPostApi";
import Modal from "react-modal";
import { uploadFile } from "../services/uploadFileService";

// Modal styles
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "600px",
    width: "90%",
    borderRadius: "8px",
    padding: "0",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
};

