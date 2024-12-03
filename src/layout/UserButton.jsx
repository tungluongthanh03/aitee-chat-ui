import React, { useState } from "react";
import "../styles/UserButton.css";

const UserButton = ({id, username, func}) => {
  return (
    <div className="tag" id={id}>
      <span className="tag-text">{username}</span>
      <button className="close-btn" onClick={func}>X</button>
    </div>
  );
};

export default UserButton;
