import React, { useState } from "react";
import "./styles.css";
import axios from "axios";
import {
  Typography,
  ListItemText,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";

import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Photo({ photos, users, userIdMe, handleUpdatePhotos, code, token }) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState(undefined);
  const [successMessage, setSuccessMessage] = useState("");

  const handleDeletePost = async (e) => {
    e.preventDefault();

    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa ảnh này?");
    if (!confirmDelete) return;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.delete(
        `${import.meta.env.VITE_CLIENT_PORT}/user/deleteimage/${photos._id}`,
        config
      );
      handleUpdatePhotos();
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const handleCommentPost = async (e) => {
    e.preventDefault();

    setComment("");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      setError("");
      await axios.post(
        `${import.meta.env.VITE_CLIENT_PORT}/user/commentsOfPhoto/${
          photos._id
        }`,
        {
          comment: comment,
          user_id: userIdMe,
        },
        config
      );

      handleUpdatePhotos();
      setSuccessMessage("Comment posted successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div
      key={photos._id}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "40%",
        marginLeft: 60,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "white",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "400px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {photos.user_id === userIdMe && (
          <DeleteOutlineSharpIcon
            className="delete-icon"
            onClick={handleDeletePost}
          />
        )}
        <img
          src={`data:image/jpeg;base64,${code}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="img"
        />
      </div>
      <div>
        <ListItemText
          primary={`Upload time: ${photos.date_time.slice(
            0,
            10
          )} ${photos.date_time.slice(11, 19)}`}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                color="textPrimary"
                style={{ fontSize: "1.2rem" }}
              >
                Comments:
              </Typography>
              <div>
                {photos.comments && photos.comments.length > 0 ? (
                  photos.comments.map((comment) => {
                    let firstName = "";
                    let lastName = "";
                    for (const user of users) {
                      if (user._id === comment.user_id) {
                        firstName = user.first_name;
                        lastName = user.last_name;
                        break;
                      }
                    }

                    return (
                      <Grid item key={comment._id}>
                        <Typography variant="body2" className="comment">
                          <span style={{ fontWeight: "bold", margin: 10 }}>
                            <AccountCircleIcon /> {firstName} {lastName}
                          </span>{" "}
                          : {comment.comment}
                        </Typography>
                      </Grid>
                    );
                  })
                ) : (
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                    style={{ margin: 10, opacity: 0.5 }}
                  >
                    No Comment.
                  </Typography>
                )}
              </div>
              <form onSubmit={handleCommentPost}>
                <Grid container spacing={1}>
                  <Grid item xs={9}>
                    <TextField
                      label="Add Comment"
                      placeholder="Add Comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      multiline
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button variant="contained" type="submit" size="small">
                      Post Comment
                    </Button>
                  </Grid>
                </Grid>
                {error && (
                  <Typography variant="body1" style={{ color: "red" }}>
                    {error}
                  </Typography>
                )}
                {successMessage && (
                  <Typography variant="body1" style={{ color: "green" }}>
                    {successMessage}
                  </Typography>
                )}
              </form>
            </React.Fragment>
          }
        />
      </div>
    </div>
  );
}

export default Photo;

Photo.propTypes = {
  photos: PropTypes.object,
  users: PropTypes.object,
  userIdMe: PropTypes.string,
  handleUpdatePhotos: PropTypes.func,
  code: PropTypes.string,
  token: PropTypes.string,
};
