import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { InputAdornment, Tooltip, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { API_URL } from "../../globalconstant.js";

export function Signup() {
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
        Firstname: "",
        Lastname: "",
        Username: "",
        email: "",
        Password: "",
        // Status: "Inactive",
      },
      validationSchema: formvalidationSchema,
      onSubmit: (newUser) => {
        // console.log(newUser);
        addUser(newUser);
      },
    });
  const [text, setText] = React.useState("Show");
  const [visible, setVisible] = React.useState("password");
  const icon =
    visible === "password" ? <VisibilityIcon /> : <VisibilityOffIcon />;
  const visibility = () => {
    setVisible((visible) => (visible === "password" ? "text" : "password"));
    setText((text) => (text === "Show" ? "Hide" : "Show"));
  };
  const addUser = (newUser) => {
    fetch(`${API_URL}/users/signup`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.status === 200) {
        setMsg({
          msg: "Signup successfully",
          status: "success",
        });
        window.location.replace(`/login`);
      } else {
        setMsg({ msg: "Credentials already exists", status: "error" });
      }
      // console.log(response);
      setOpen(true);
    });
  };
  return (
    <div className="signuppage">
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
          Sign Up Now
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Firstname && touched.Firstname}
            value={values.Firstname}
            helperText={
              errors.Firstname && touched.Firstname && errors.Firstname
            }
            name="Firstname"
            id="Firstname"
            label="FirstName"
            placeholder="Enter the FirstName"
            fullWidth
            sx={{ margin: "5px" }}
          />
          <TextField
            variant="outlined"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Lastname && touched.Lastname}
            value={values.Lastname}
            helperText={errors.Lastname && touched.Lastname && errors.Lastname}
            name="Lastname"
            id="Lastname"
            label="LastName"
            placeholder="Enter the LastName"
            fullWidth
            sx={{ margin: "5px" }}
          />
          <TextField
            variant="outlined"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Username && touched.Username}
            value={values.Username}
            helperText={errors.Username && touched.Username && errors.Username}
            name="Username"
            id="Username"
            label="UserName"
            placeholder="Enter the UserName"
            fullWidth
            sx={{ margin: "5px" }}
          />
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
            error={errors.Password && touched.Password}
            value={values.Password}
            helperText={errors.Password && touched.Password && errors.Password}
            name="Password"
            id="Password"
            label="Password"
            type={visible}
            placeholder="Enter the Password"
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
          <Button sx={{ margin: "5px" }} type="submit" variant="contained">
            Get Started
          </Button>
        </form>
        <label className="account">Already have an Account?</label>
        <Button
          type="submit"
          className="signuploginbutton"
          variant="text"
          onClick={() => history.push("/")}
        >
          Login
        </Button>
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
      ;
    </div>
  );
}
// formValidationSchema
const formvalidationSchema = Yup.object({
  Firstname: Yup.string().required("Please enter your FirstName"),
  Lastname: Yup.string().required("Please enter your LastName"),
  Username: Yup.string().required("Please enter your UserName"),
  email: Yup.string()
    .email("Please enter the valid email")
    .required("please enter yor email"),
  Password: Yup.string()
    .min(8, "Too short password")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    )
    .required("Please Enter your password"),
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
