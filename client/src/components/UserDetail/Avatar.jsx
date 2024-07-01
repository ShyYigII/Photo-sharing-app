import CloudUpload from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { env } from "../../services/config";

const Avatar = ({ idOfMe, token }) => {
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const { userId } = useParams();

  const [avatar, setAvatar] = useState(null);

  const handleChangeAvatar = async (e) => {
    e.preventDefault();
    if (!file) {
      console.log("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("myImage", file);
    formData.append("user_id", idOfMe);
    setLoading(true);
    try {
      const response = await axios.post(
        `${env.VITE_API_ENDPOINT}/user/uploadavatar/${idOfMe}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setLoading(false);
      handleClose();
      getData();
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setFile(null);
  };

  const handleOpenChoosePhoto = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (file) setUrl(URL.createObjectURL(file));
    else {
      setUrl("");
    }
  }, [file]);

  const handleFileChange = (event) => {
    const fileSelected = event.target.files[0];

    if (fileSelected) {
      setFile(fileSelected);
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
        `${env.VITE_API_ENDPOINT}/user/avatarOfUser/${userId}`,
        config
      );
      console.log("res", res);
      setLoading(false);

      setAvatar(res.data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  useEffect(() => {
    getData();
  }, [userId]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "300px",
          width: "290px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "20px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <>
      <div className="avatar-container">
        <Tooltip
          title="Change Avatar"
          disableHoverListener={idOfMe !== userId}
          onClick={(event) => {
            if (idOfMe === userId) {
              handleOpenChoosePhoto(event);
            }
          }}
          placement="bottom"
        >
          {" "}
          {avatar && avatar.encode_image ? (
            <img
              src={`data:image/jpeg;base64,${avatar.encode_image}`}
              alt="avatar"
              className="avatar-image"
              style={{
                cursor: idOfMe === userId && "pointer",
                height: "290px",
                width: "290px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            <img
              src="/images/avatar.jpg"
              alt="avatar"
              className="avatar-image"
              style={{
                cursor: idOfMe === userId && "pointer",
                height: "290px",
                width: "290px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          )}
        </Tooltip>
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth={false}>
        <DialogTitle>Change Avatar </DialogTitle>
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
              onClick={handleChangeAvatar}
              startIcon={
                loading ? <CircularProgress size={20} /> : <CloudUpload />
              }
              disabled={!file || loading}
            >
              {loading ? "Changing..." : "Change"}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Avatar;

Avatar.propTypes = {
  token: PropTypes.string,
  idOfMe: PropTypes.string,
  setLoading: PropTypes.func,
  loading: PropTypes.bool,
};
