import React, { useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { env } from "../../services/config";

function UserList({ isLogin, token }) {
  const [users, setUsers] = useState([]);

  const { userId } = useParams();

  const getUserListData = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.get(`${env.VITE_API_ENDPOINT}/user/list`, config);

      setUsers(res.data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  useEffect(() => {
    getUserListData();
  }, [isLogin]);

  useEffect(() => {}, [userId]);

  return (
    <div style={{ display: isLogin ? "block" : "none" }}>
      <Typography variant="body1" sx={{ marginBottom: "10px" }}>
        {isLogin
          ? "Welcome! Below is your friends list"
          : "Login to view users."}
      </Typography>
      {isLogin && (
        <Typography
          variant="body1"
          align="center"
          style={{ fontSize: 20, fontWeight: "600", marginBottom: "10px" }}
        >
          This is your user list
        </Typography>
      )}

      {isLogin && (
        <List>
          {users && users.length > 0 ? (
            users.map((user) => (
              <React.Fragment key={user._id}>
                <ListItem
                  button
                  component={Link}
                  to={`/users/${user._id}`}
                  sx={{
                    backgroundColor:
                      userId === user._id ? "#cccccc" : "transparent",
                    "&:hover": {
                      backgroundColor: "#cccccc",
                    },
                  }}
                >
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body1">Loading ...</Typography>
          )}
        </List>
      )}
    </div>
  );
}
export default UserList;

UserList.propTypes = {
  token: PropTypes.string,
  isLogin: PropTypes.bool,
};
