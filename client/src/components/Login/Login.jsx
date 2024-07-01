import { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";
import "./styles.css";

import axios from "axios";
function Login({ login }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(undefined);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_CLIENT_PORT}/user/login`,
        {
          login_name: username,
          password: password,
        }
      );

      const { token, user } = await res.data;

      if (token) {
        login(user, token);
      }
    } catch (e) {
      console.log("eeerrr", e);
      setError(e);
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <TextField
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />

      <Button variant="contained" type="submit">
        Sign In
      </Button>
      {error && error.response && (
        <Typography variant="body1">{error.response.data}</Typography>
      )}
    </form>
  );
}

export default Login;

Login.propTypes = {
  login: PropTypes.func,
};
