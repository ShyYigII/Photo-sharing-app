import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./styles.css";
import axios from "axios";
import PropTypes from "prop-types";
import { Typography, List, Button, CircularProgress, Box } from "@mui/material";
import Photo from "./Photo";

function UserPhotos({ userIdMe, isGetDataPhoto, setGetDataPhoto, token }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_CLIENT_PORT}/user/list`,
        config
      );
      console.log(res.data);
      setUsers(res.data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const getData = async () => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_CLIENT_PORT}/user/photosOfUser/${userId}`,
        config
      );
      setPhotos(res.data);
      console.log(res.data);
    } catch (e) {
      console.log("Error: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isGetDataPhoto) {
      getData();
      setGetDataPhoto(false);
    }
  }, [isGetDataPhoto]);

  const getUserInfo = (userId) => {
    for (const user of users) {
      if (user._id === userId) {
        return { userFirstName: user.first_name, userLastName: user.last_name };
      }
    }
    return { userFirstName: "", userLastName: "" };
  };

  const { userFirstName, userLastName } = getUserInfo(userId);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getData();
  }, [userId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Photos of {userFirstName} {userLastName}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Gallery contains {photos.length} photos
      </Typography>
      <List
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {console.log("users: ", users)}
        {console.log("photos: ", photos)}

        {photos &&
          photos.map((photos) => (
            <Photo
              key={photos._id}
              photos={photos}
              users={users}
              userIdMe={userIdMe}
              handleUpdatePhotos={getData}
              code={photos.encode_image}
              token={token}
              setLoading={setLoading}
            />
          ))}
      </List>
      <Button
        component={Link}
        to={`/users/${userId}`}
        variant="contained"
        color="primary"
      >
        Back to User Detail
      </Button>
    </div>
  );
}
export default UserPhotos;

UserPhotos.propTypes = {
  userIdMe: PropTypes.string,
  isGetDataPhoto: PropTypes.bool,
  setGetDataPhoto: PropTypes.func,
  token: PropTypes.string,
};
