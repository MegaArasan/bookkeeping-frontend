import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { drawerWidth } from "../AppBar/Sidebar.js";
import { useFormik } from "formik";
import * as Yup from "yup";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { API_URL } from "../../globalconstant.js";
import { useParams } from "react-router-dom";

export function Editcustomer() {
  const [customer, setcustomer] = useState("");
  const { id } = useParams();
  // console.log(id);
  useEffect(() => {
    fetch(`${API_URL}/usercustomer/${id}`, { method: "GET" })
      .then((data) => data.json())
      .then((x) => setcustomer(x));
  }, [id]);

  return customer ? <EditCustomer customer={customer} id={id} /> : "";
}

function EditCustomer({ customer, id }) {
  //   console.log(customer, id);
  const [open, setOpen] = useState(false);
  const [Msg, setMsg] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: {
        customerName: customer.customerName,
        email: customer.email,
        phoneno: customer.phoneno,
        address: customer.address,
      },
      validationSchema: formvalidationSchema,
      onSubmit: (customer) => {
        // console.log(customer);
        updatecustomer(customer);
      },
    });
  const updatecustomer = (customer) => {
    fetch(`${API_URL}/usercustomer/${id}`, {
      method: "PUT",
      body: JSON.stringify(customer),
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => data.json)
      .then(() => {
        setMsg({ msg: "Customer updated successfully", status: "success" });
        setOpen(true);
        window.location.replace("/customerlist");
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
        backgroundColor: "white",
      }}
    >
      <div className="addcustomer">
        <Typography sx={{ fontFamily: "Aladin" }} variant="h4">
          Edit Customer Details
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.customerName}
            error={errors.customerName && touched.customerName}
            helperText={
              errors.customerName && touched.customerName && errors.customerName
            }
            name="customerName"
            margin="dense"
            id="customerName"
            label="Customer Name"
            variant="standard"
            placeholder="Enter Customer name"
            fullWidth
          />
          <TextField
            variant="standard"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            error={errors.email && touched.email}
            helperText={errors.email && touched.email && errors.email}
            placeholder="Enter customer Email"
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
          />
          <TextField
            variant="standard"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.phoneno}
            error={errors.phoneno && touched.phoneno}
            helperText={errors.phoneno && touched.phoneno && errors.phoneno}
            placeholder="Enter customer phone No"
            name="phoneno"
            margin="dense"
            id="phoneno"
            label="Phone No"
            fullWidth
          />
          <TextField
            variant="standard"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.address}
            error={errors.address && touched.address}
            helperText={errors.address && touched.address && errors.address}
            placeholder="Enter customer Address"
            name="address"
            margin="dense"
            id="address"
            label="Address"
            fullWidth
          />
          <Button type="submit" color="warning" variant="contained">
            Save Customer
          </Button>
        </form>
      </div>
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
    </Box>
  );
}
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const formvalidationSchema = Yup.object({
  customerName: Yup.string().required("Please fill the Customer Name"),
  email: Yup.string()
    .email("Please enter the valid email")
    .required("Required Field"),
  phoneno: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Why not fill this phone no 🤯")
    .min(8, "Please Enter the valid phone number")
    .max(10, "Please Enter the valid phone number"),
  address: Yup.string().required("Please fill the addres"),
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
