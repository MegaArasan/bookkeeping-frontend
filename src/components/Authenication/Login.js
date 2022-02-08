import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { InputAdornment, Tooltip, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { API_URL } from "../../globalconstant.js";

export function Login() {
  const [open, setOpen] = React.useState(false);
  const [Msg, setMsg] = React.useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const history = useHistory();
  const { handleChange, handleSubmit, handleBlur, errors, values, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: formvalidationSchema,
      onSubmit: (User) => {
        // console.log(User);
        Login(User);
      },
    });
  const [text, setText] = useState("Show");
  const [visible, setVisible] = useState("password");
  const icon =
    visible === "password" ? <VisibilityIcon /> : <VisibilityOffIcon />;
  const visibility = () => {
    setVisible((visible) => (visible === "password" ? "text" : "password"));
    setText((text) => (text === "Show" ? "Hide" : "Show"));
  };

  const Login = (User) => {
    fetch(`${API_URL}/users/login`, {
      method: "POST",
      body: JSON.stringify(User),
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => data.json())
      .then((x) => {
        // console.log(x);
        localStorage.setItem("user",JSON.stringify(x));
        if (x.Username != null) {
          setMsg({ msg: "Login Successfully", status: "success" });
          setOpen(true);
          localStorage.setItem("token", x.token);
          localStorage.setItem("Username", x.Username);
          history.push("/Dashboard");
        } else {
          setMsg({ msg: x.message, status: "error" });
          setOpen(true);
        }
      })
      .catch((err) => {
        setMsg({ msg: err.message, status: "error" });
        setOpen(true);
      });
  };
  return (
    <div className="loginpage">
      <div className="brand">
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Aladin",
            fontSize: { sm: "35px", xs: "28px" },
          }}
        >
          Book Invoice
        </Typography>
      </div>
      <div className="formcontainer">
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Roboto Condensed",
            fontSize: { sm: "35px", xs: "28px" },
          }}
        >
          Log In
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email && touched.email}
            value={values.email}
            helperText={errors.email && touched.email && errors.email}
            name="email"
            id="email"
            label="Email"
            placeholder="Enter Email"
            fullWidth
            sx={{ margin: "5px" }}
          />
          <TextField
            variant="outlined"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password && touched.password}
            value={values.password}
            helperText={errors.password && touched.password && errors.password}
            name="password"
            id="password"
            label="password"
            type={visible}
            placeholder="Enter the password"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Tooltip title={text}>
                    <IconButton onClick={() => visibility()}>{icon}</IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            sx={{ margin: "5px" }}
          />
          <Button
            sx={{ marginRight: "20px" }}
            variant="text"
            onClick={() => history.push("/forgotpassword")}
          >
            Forgot Password?
          </Button>
          <Button type="submit" variant="contained" color="success">
            Log In
          </Button>
        </form>
        <div style={{ margin: "5px" }}>
          <label className="account">Don't have an Account?</label>
          <Button
            type="submit"
            className="signuploginbutton"
            variant="text"
            onClick={() => history.push("/signup")}
          >
            Sign up
          </Button>
        </div>
      </div>
      <Typography variant="p">
        ©2022 Book Invoice.All rights reserved{" "}
      </Typography>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={Msg.status}
          sx={{ width: "100%" }}
        >
          {Msg.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

// formValidationSchema
const formvalidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter the valid email")
    .required("Required Field"),
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
