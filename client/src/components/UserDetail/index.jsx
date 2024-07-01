import { useState } from "react";
import { Button, Card, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./styles.css";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState();

  const getData = async () => {
    try {
      const url = `${import.meta.env.VITE_CLIENT_PORT}/user/${userId}`;
      const res = await axios.get(url);
      setUser(res.data);
      {
        console.log("user", user);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <>
      {user && (
        <Card
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingBottom: "20px",
          }}
        >
          <AccountCircleIcon sx={{ fontSize: "150px" }} />

          <Typography
            variant="h6"
            style={{ marginBottom: "10px", color: "#3f51b5" }}
          >
            {user.first_name + " " + user.last_name}
          </Typography>

          <Typography variant="body1" style={{ marginBottom: "8px" }}>
            <strong>First Name:</strong> {user.first_name}
          </Typography>
          <Typography variant="body1" style={{ marginBottom: "8px" }}>
            <strong>Last Name:</strong> {user.last_name}
          </Typography>
          <Typography variant="body1" style={{ marginBottom: "8px" }}>
            <strong>Location:</strong> {user.location}
          </Typography>
          <Typography
            variant="body1"
            style={{ marginBottom: "8px", maxWidth: "80%" }}
          >
            <strong>Description:</strong> {user.description}
          </Typography>
          <Typography variant="body1" style={{ marginBottom: "8px" }}>
            <strong>Occupation:</strong> {user.occupation}
          </Typography>
          <Typography variant="body1">
            <Button
              component={Link}
              to={`/photos/${user._id}`}
              variant="contained"
              color="primary"
            >
              See Photos
            </Button>
          </Typography>
        </Card>
      )}
    </>
  );
}

export default UserDetail;