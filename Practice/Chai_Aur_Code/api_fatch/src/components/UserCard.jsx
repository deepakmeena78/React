import React from "react";

const UserCard = (props) => {
  return (
    <div className="user_card">
      <img src="" alt="" />
      <h3>Name : {props.data.name.first}</h3>
      <p>Mo. : {props.data.phone}</p>
      <p>
        Location : {props.data.location.city},State :{" "}
        {props.data.location.state}
      </p>
    </div>
  );
};

export default UserCard;
