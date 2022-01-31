import * as React from "react";
import { Typography, Box, IconButton } from "@mui/material";
import { drawerWidth } from "../AppBar/Sidebar.js";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { API_URL } from "../../globalconstant.js";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import { useHistory } from "react-router-dom";

export function Customerlist() {
  const [customers, setcustomers] = useState("");
  const id = localStorage.getItem("token");
  const getcustomer = () => {
    fetch(`${API_URL}/usercustomer/customerlist`, {
      method: "GET",
      headers: { "x-auth-token": id },
    })
      .then((data) => data.json())
      .then((x) => setcustomers(x));
  };
  useEffect(getcustomer, [id]);
  return customers ? <CustomerList customers={customers} /> : "";
}

function CustomerList({ customers }) {
  const [open, setOpen] = React.useState(false);
  const [Msg, setMsg] = React.useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // console.log(customers);
  const history = useHistory();
  const deletecustomer = (_id) => {
    fetch(`${API_URL}/usercustomer/${_id}`, {
      method: "DELETE",
    }).then(() => {
      setOpen(true);
      setMsg({ msg: "Customer Deleted successfully", status: "success" });
      window.location.reload();
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
      <Typography variant="h3" sx={{ fontFamily: "Aladin" }}>
        Customer List
      </Typography>
      {customers.length === 0 ? (
        <div>
          <img
            src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg?size=338&ext=jpg"
            alt="nothing"
          />
          <br />
          <Typography variant="h6">
            No datas are added..please add some customers to customers list
          </Typography>
        </div>
      ) : (
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>s.No</TableCell>
                  <TableCell align="center">Customer Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Phone No</TableCell>
                  <TableCell align="center">Address</TableCell>
                  <TableCell colSpan={2} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map(
                  ({ customerName, email, phoneno, address, _id }, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">{customerName}</TableCell>
                      <TableCell align="center">{email}</TableCell>
                      <TableCell align="center">{phoneno}</TableCell>
                      <TableCell align="center">{address}</TableCell>
                      <TableCell align="center">
                        {
                          <IconButton
                            onClick={() =>
                              history.push(`/customer/edit/${_id}`)
                            }
                          >
                            <EditIcon style={{ color: "#388e3c" }} />
                          </IconButton>
                        }
                      </TableCell>
                      <TableCell align="center">
                        {
                          <IconButton onClick={() => deletecustomer(_id)}>
                            <DeleteIcon style={{ color: "#d32f2f" }} />
                          </IconButton>
                        }
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
