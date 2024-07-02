import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import "./styles.css";
import Login from "./Login";
import Register from "./Register";
import PropTypes from "prop-types";

function LoginRegister({ login }) {
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress size={80} />
      </div>
    );
  }
  return (
    <>
      {showRegister ? (
        <Register />
      ) : (
        <Login login={login} setLoading={setLoading} />
      )}
      <Button
        className="registerButton"
        onClick={() => setShowRegister(!showRegister)}
      >
        {showRegister ? "Go to Login" : "Register Now"}
      </Button>
    </>
  );
}

export default LoginRegister;

LoginRegister.propTypes = {
  login: PropTypes.func,
};
