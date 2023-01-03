import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import EditProfile from "./components/EditProfile";
import ProfileDetails from "./components/ProfileDetails";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    avatarImage: "",
  });
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/user/${auth.userId}`,
          {
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        setCredentials(res.data.message);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [isEditing]);

  if (isLoading) {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      {!isEditing ? (
        <ProfileDetails
          userId={auth.userId}
          credentials={credentials}
          setIsEditing={setIsEditing}
        />
      ) : (
        <div
          className='auth-form-container'
          style={{ position: "relative", height: "600px" }}>
          <EditProfile
            userId={auth.userId}
            credentials={credentials}
            setCredentials={setCredentials}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
