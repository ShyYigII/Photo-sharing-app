import "./App.css";
import { useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList/index";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/Login/LoginRegister";

import axios from "axios";

const App = () => {
  const [isLogin, setLogin] = useState(false);
  const [userId, setUserId] = useState("");

  const [userName, setuserName] = useState("You are not logged in");

  const [isGetDataPhoto, setIsGetDataPhoto] = useState(false);
  const [token, setToken] = useState("abc");
  const [user, setUser] = useState();

  const logout = () => {
    setLogin(false);
  };

  const login = async (u, tk) => {
    try {
      console.log(import.meta.env.VITE_CLIENT_PORT);
      const res = await axios.get(
        `${import.meta.env.VITE_CLIENT_PORT}/user/${u._id}`
      );

      setLogin(true);
      setUserId(res.data._id);
      setuserName(res.data.first_name + " " + res.data.last_name);
      setToken(tk);

      setUser(u);
    } catch (e) {
      console.log(e);
    }
  };

  const setGetDataPhoto = (item) => {
    setIsGetDataPhoto(item);
  };

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar
              setGetDataPhoto={setGetDataPhoto}
              userName={userName}
              logout={logout}
              isLogin={isLogin}
              idOfMe={userId}
              user={user}
              token={token}
            />
          </Grid>

          <div className="main-topbar-buffer" />
          <Grid item sm={4} md={2}>
            <Paper className="main-grid-item scrollable">
              <UserList isLogin={isLogin} token={token} />
            </Paper>
          </Grid>
          <Grid item sm={8} md={10}>
            <Paper
              className="main-grid-item scrollable"
              style={{
                ...(isLogin && { display: "flex", justifyContent: "center" }),
              }}
            >
              <Routes>
                <Route
                  path="/users/:userId"
                  element={
                    isLogin ? <UserDetail /> : <Navigate to="/loginregister" />
                  }
                />

                <Route
                  path="/photos/:userId"
                  element={
                    isLogin ? (
                      <UserPhotos
                        token={token}
                        setGetDataPhoto={setGetDataPhoto}
                        isGetDataPhoto={isGetDataPhoto}
                        userIdMe={userId}
                      />
                    ) : (
                      <Navigate to="/loginregister" />
                    )
                  }
                />

                <Route
                  path="/users"
                  element={
                    isLogin ? (
                      <UserList isLogin={isLogin} />
                    ) : (
                      <Navigate to="/loginregister" />
                    )
                  }
                />
                <Route
                  path="/"
                  element={
                    isLogin ? (
                      <Typography variant="body1">
                        Please select an user from left side.
                      </Typography>
                    ) : (
                      <Navigate to="/loginregister" />
                    )
                  }
                />

                {/* {!isLogin && <Route path="/loginregister" element={<LoginRegister login={login}/>}/>} */}
                <Route
                  path="/loginregister"
                  element={
                    !isLogin ? (
                      <LoginRegister login={login} />
                    ) : (
                      <Navigate to={`/users/${userId}`} />
                    )
                  }
                />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
