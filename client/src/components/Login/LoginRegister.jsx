import { useState } from "react";
import { Button } from "@mui/material";
import "./styles.css";
import Login from "./Login";
import Register from "./Register";
import PropTypes from 'prop-types';

function LoginRegister({ login }) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      {showRegister ? <Register></Register> : <Login login={login}></Login>}
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

LoginRegister.propTypes ={
	login: PropTypes.func
}