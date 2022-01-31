import {
  Box,
  Avatar,
  Button,
  Paper,
  TextField,
  Grid,
  Card,
  Typography,
} from "@mui/material";
import { drawerWidth } from "../AppBar/Sidebar.js";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API_URL } from "../../globalconstant.js";
import { useState, useEffect } from "react";

export function Settings() {
  const history = useHistory();
  const id = localStorage.getItem("token");
  const Username = localStorage.getItem("Username");
  const [User, setUser] = useState("");
  //   console.log(User);
  useEffect(() => {
    fetch(`${API_URL}/users/getuser`, {
      method: "GET",
      headers: { "x-auth-token": id },
    })
      .then((data) => data.json())
      .then((user) => setUser(user));
  }, [id]);

  if (!Username) {
    history.push("/login");
  }

  return User ? <UpdateUser User={User} setUser={setUser} /> : "";
}

function UpdateUser({ User, setUser }) {
  const [switchEdit, setSwitchEdit] = useState(0);
  const Username = localStorage.getItem("Username");
  const { handleChange, handleBlur, handleSubmit, values, touched, errors } =
    useFormik({
      initialValues: {
        Username: Username,
        businessName: User.businessName,
        contactAddress: User.contactAddress,
        phoneno: User.phoneno,
        logo: User.logo,
      },
      validationSchema: formvalidationSchema,
      onSubmit: (user) => {
        console.log(user);
        Updateuser(user);
      },
    });
  const Updateuser = (user) => {
    fetch(`${API_URL}/users/edit/${user._id}`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => data.json())
      .then((user) => {
        setUser(user);
        window.location.reload();
        setSwitchEdit(0);
      });
  };
  return (
    <Box
      sx={{
        width: {
          sm: `calc(100% - ${drawerWidth}px)`,
          xs: `100%`,
        },
        ml: { sm: `${drawerWidth}px`, xs: 0 },
        backgroundColor: "#a7e7e5",
      }}
    >
      <div className="pageContainer">
        <section className="hero">
          <Typography
            sx={{ fontFamily: "Aladin", fontSize: { xs: "30px", md: "45px" } }}
          >
            Profile Settings
          </Typography>
          <div className="paragraph">
            <Typography variant="p">
              Edit/ update your business profile
            </Typography>
          </div>
        </section>
        <section className="stat">
          {switchEdit === 1 && (
            <form onSubmit={handleSubmit}>
              <TextField
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.Username}
                error={errors.Username && touched.Username}
                helperText={
                  errors.Username && touched.Username && errors.Username
                }
                name="Username"
                margin="dense"
                id="customerName"
                label="UserName"
                variant="standard"
                placeholder="Enter username"
                fullWidth
              />
              <TextField
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.businessName}
                error={errors.businessName && touched.businessName}
                helperText={
                  errors.businessName &&
                  touched.businessName &&
                  errors.businessName
                }
                name="businessName"
                margin="dense"
                id="businessName"
                label="Business Name"
                variant="standard"
                placeholder="Enter your Business name"
                fullWidth
              />
              <TextField
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.contactAddress}
                error={errors.contactAddress && touched.contactAddress}
                helperText={
                  errors.contactAddress &&
                  touched.contactAddress &&
                  errors.contactAddress
                }
                name="contactAddress"
                margin="dense"
                id="contactAddress"
                label="Contact Address"
                variant="standard"
                placeholder="Enter your Address"
                fullWidth
              />
              <TextField
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phoneno}
                error={errors.phoneno && touched.phoneno}
                helperText={errors.phoneno && touched.phoneno && errors.phoneno}
                name="phoneno"
                margin="dense"
                id="phoneno"
                label="Phone No"
                variant="standard"
                placeholder="Enter your phone no"
                fullWidth
              />
              <TextField
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.logo}
                error={errors.logo && touched.logo}
                helperText={errors.logo && touched.logo && errors.logo}
                name="logo"
                margin="dense"
                id="logo"
                label="Company Logo"
                variant="standard"
                placeholder="Enter your company logo Url"
                fullWidth
              />
              <Button type="submit" color="warning" variant="contained">
                Update user
              </Button>
            </form>
          )}
          {switchEdit === 0 && (
            <Grid container justifyContent="center">
            <Card
              sx={{
                maxWidth: "350px",
                width:"100%",
              }}
            >
              <Paper elevation={2}>
                <Grid container justifyContent="center">
                  <Avatar
                    style={{
                      width: "100px",
                      height: "100px",
                      margin: "30px",
                    }}
                    src={User.logo}
                    alt="avatar"
                  />
                </Grid>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  direction="column"
                >
                  <Grid ite>
                    <b>User Name:</b>
                    <Typography variant="p">{User.Username}</Typography>
                  </Grid>
                  <Grid item>
                    <b>Business Name:</b>
                    <Typography variant="p">{User.businessName}</Typography>
                  </Grid>
                  <Grid item>
                    <b>Address:</b>
                    <Typography variant="p">{User.contactAddress}</Typography>
                  </Grid>
                  <Grid item>
                    <b>Phone No:</b>
                    <Typography variant="p">{User.phoneno}</Typography>
                  </Grid>
                  <Grid item>
                    <b>Email:</b>
                    <Typography variant="p">{User.email}</Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      style={{ margin: "30px", padding: "15px 30px" }}
                      onClick={() => setSwitchEdit(1)}
                    >
                      Edit Profile
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Card>
            </Grid>
          )}
        </section>
      </div>
    </Box>
  );
}

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const formvalidationSchema = Yup.object({
  businessName: Yup.string().required(),
  phoneno: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Why not fill this phone no 🤯")
    .min(8, "Please Enter the valid phone number")
    .max(10, "Please Enter the valid phone number"),
  contactAddress: Yup.string().required("Please fill the addres"),
});
