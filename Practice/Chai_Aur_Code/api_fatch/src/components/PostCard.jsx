import React from "react";
const PostCard = (props) => {
  return (
    <div className="post-card">
      <h3>Title: {props.title}</h3>
      <p>Body : {props.body}</p>
    </div>
  );
};

export default PostCard;
