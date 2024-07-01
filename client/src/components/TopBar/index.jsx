import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  Box,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import "./styles.css";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import PropTypes from "prop-types";

function TopBar({ logout, isLogin, idOfMe, setGetDataPhoto, user, token }) {
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_CLIENT_PORT}/user/logout`,
        {
          user: user,
        },
        config
      );

      logout();
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      console.log("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("myImage", file);
    formData.append("user_id", idOfMe);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_CLIENT_PORT}/user/uploadimage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setGetDataPhoto(true);
      setLoading(false);
      handleClose();
      nav(`/photos/${idOfMe}`);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
  };

  const handleOpenChoosePhoto = () => {
    setOpen(true);
  };

  const handleGoHomePage = () => {
    nav(`/users/${user._id}`);
  };

  const handleFileChange = (event) => {
    const fileSelected = event.target.files[0];

    if (fileSelected) {
      setFile(fileSelected);
    }
  };

  useEffect(() => {
    if (file) setUrl(URL.createObjectURL(file));
    else {
      setUrl("");
    }
  }, [file]);

  return (
    <>
      <AppBar className="topbar-appBar">
        <Toolbar className="toolbar">
          <Typography variant="h4" color="inherit">
            {isLogin ? (
              <Button sx={{ color: "white" }} onClick={handleGoHomePage}>
                <HomeIcon sx={{ fontSize: "50px" }} />
              </Button>
            ) : (
              "You are not logged in"
            )}
          </Typography>

          <div className="logout" style={{ position: "absolute", right: 10 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenChoosePhoto}
            >
              <AddAPhotoIcon />
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoHomePage}
              style={{ marginLeft: 10 }}
            >
              My page{" "}
            </Button>
            {isLogin && (
              <Button
                style={{ marginLeft: 10 }}
                variant="contained"
                type="submit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleClose} maxWidth={false}>
        <DialogTitle>Upload Image </DialogTitle>
        <DialogContent
          sx={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "50vw",
            height: "70vh",
          }}
        >
          <DialogContentText sx={{ fontSize: "20px" }}>
            Choose a photo
          </DialogContentText>
          <Box
            sx={{
              padding: "10px",
              height: "40px",
              width: "80%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <form encType="multipart/form-data" method="POST">
              <input
                style={{
                  cursor: "pointer",
                }}
                type="file"
                name="myImage"
                accept="image/*"
                onChange={handleFileChange}
              />

              <Box
                sx={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  marginTop: "10px",
                  height: "370px",
                  width: "500px",
                  backgroundColor: "",
                }}
              >
                {url && (
                  <img
                    src={url}
                    alt="Selected"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Box>
            </form>
          </Box>
        </DialogContent>

        <DialogActions>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              width: "100%",
            }}
          >
            <Button onClick={handleClose}>Cancel</Button>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginLeft: 10 }}
              onClick={handleUpload}
              startIcon={
                loading ? <CircularProgress size={20} /> : <CloudUploadIcon />
              }
              disabled={!file || loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TopBar;

TopBar.propTypes = {
  title: PropTypes.string,
  userName: PropTypes.string,
  logout: PropTypes.func,
  isLogin: PropTypes.bool,
  idOfMe: PropTypes.string,
  setGetDataPhoto: PropTypes.func,
  user: PropTypes.object,
  token: PropTypes.string,
};
