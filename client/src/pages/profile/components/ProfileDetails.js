import React from "react";
import "./ProfileDetails.css";

const ProfileDetails = ({ userId, credentials, setIsEditing }) => {
  return (
    <div className='profileDetails-wrapper'>
      <h1>My Profile</h1>
      <div className='profileDetails-container'>
        {credentials.avatarImage ? (
          <img
            style={{ height: "200px", width: "300px" }}
            src={`${process.env.REACT_APP_ASSET_URL}/avatarImage%2F${userId}%2F${credentials.avatarImage}?alt=media`}
            alt='User Avatar'
          />
        ) : (
          <div>
            <p>Avatar Image Not Uploaded</p>
          </div>
        )}
        <div className='profileDetails'>
          <p>Name: {credentials.name}</p>
          <p>Email: {credentials.email}</p>
          <p>Phone: +91{credentials.phone}</p>
          <p>Address: {credentials.address}</p>
          <button
            style={{
              height: "2rem",
              width: "5rem",
              backgroundColor: "#FF6E31",
              borderColor: "#FF6E31",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
            type='button'
            onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProfileDetails;
