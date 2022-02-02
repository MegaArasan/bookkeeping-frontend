import { Box, Typography } from "@mui/material";
import { drawerWidth } from "../AppBar/Sidebar.js";
import { useState, useEffect } from "react";
import { API_URL } from "../../globalconstant.js";
import { useHistory } from "react-router-dom";
import moment from "moment";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import { toCommas } from "../../initialState.js";
import { makeStyles } from "@mui/styles";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PieChartIcon from "@mui/icons-material/PieChart";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Avatar from "@mui/material/Avatar";
import { Chart } from "./Chart.js";

export function Dashboard() {
  const history = useHistory();
  const [invoices, setInvoices] = useState();
  const username = localStorage.getItem("Username");
  const id = localStorage.getItem("token");

  const getinvoices = () => {
    fetch(`${API_URL}/invoices/getall`, {
      method: "GET",
      headers: { "x-auth-token": id },
    })
      .then((data) => data.json())
      .then((invoices) => {
        console.log(invoices);
        setInvoices(invoices);
      });
  };
  useEffect(getinvoices, [id]);

  if (!username) {
    history.push("/login");
  }

  return invoices ? <DashBoard invoices={invoices} /> : <Nodata />;
}

const useStyles = makeStyles({
  card: {
    // maxWidth: "250px",
    witdh: "100%",
    height: "auto",
    padding: "12px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});

function DashBoard({ invoices }) {
  const classes = useStyles();
  let paymentHistory = [];
  for (let i = 0; i < invoices.length; i++) {
    let history = [];
    if (invoices[i].paymentRecords !== undefined) {
      history = [...paymentHistory, invoices[i].paymentRecords];
      paymentHistory = [].concat.apply([], history);
    }
  }

  const overDue = invoices.filter(
    (invoice) => invoice.dueDate <= new Date().toISOString()
  );
  const sortHistoryByDate = paymentHistory.sort(function (a, b) {
    var c = new Date(a.datePaid);
    var d = new Date(b.datePaid);
    return d - c;
  });

  let totalPaid = 0;
  for (let i = 0; i < invoices.length; i++) {
    if (invoices[i].totalAmountReceived !== undefined) {
      totalPaid += invoices[i].totalAmountReceived;
    }
  }

  let totalAmount = 0;
  for (let i = 0; i < invoices.length; i++) {
    totalAmount += invoices[i].total;
  }

  const unpaidInvoice = invoices?.filter(
    (invoice) => invoice.status === "Unpaid"
  );
  const paid = invoices?.filter((invoice) => invoice.status === "Paid");
  const partial = invoices?.filter((invoice) => invoice.status === "Partial");
  return (
    <Box
      sx={{
        width: {
          sm: `calc(100% - ${drawerWidth}px)`,
          xs: `100%`,
        },
        ml: { sm: `${drawerWidth}px`, xs: 0 },
        backgroundColor: "#a7e7e5",
        padding: "5px",
      }}
    >
      <section className="amountcard">
        <Card
          className={classes.card}
          style={{ backgroundColor: "rgb(94 175 255)", color: "white" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{ fontFamily: "Roboto condensed", color: "black" }}
              variant="h5"
            >
              Payment Received
            </Typography>
            <Typography variant="h6">{toCommas(totalPaid)}</Typography>
          </div>
          <TaskAltIcon color="success" />
        </Card>
        <Card className={classes.card}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{ fontFamily: "Roboto condensed", color: "gray" }}
              variant="h5"
            >
              Pending Amount
            </Typography>
            <Typography variant="h6">
              {toCommas(totalAmount - totalPaid)}
            </Typography>
          </div>
          <PendingOutlinedIcon color="error" />
        </Card>
        <Card className={classes.card}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{ fontFamily: "Roboto condensed", color: "gray" }}
              variant="h5"
            >
              Total Amount
            </Typography>
            <Typography variant="h6">{toCommas(totalAmount)}</Typography>
          </div>
          <MonetizationOnOutlinedIcon color="success" />
        </Card>
        <Card className={classes.card}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{ fontFamily: "Roboto condensed", color: "gray" }}
              variant="h5"
            >
              Total Invoices
            </Typography>
            <Typography variant="h6">{invoices.length}</Typography>
          </div>
          <DescriptionOutlinedIcon color="primary" />
        </Card>
        <Card
          className={classes.card}
          style={{ backgroundColor: "#27c56f", color: "white" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{ fontFamily: "Roboto condensed", color: "black" }}
              variant="h5"
            >
              Paid Invoices
            </Typography>
            <Typography variant="h6">{paid.length}</Typography>
          </div>
          <TaskAltIcon color="success" />
        </Card>
        <Card className={classes.card}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{ fontFamily: "Roboto condensed", color: "gray" }}
              variant="h5"
            >
              Partially Paid Invoices
            </Typography>
            <Typography variant="h6">{partial.length}</Typography>
          </div>
          <PieChartIcon color="success" />
        </Card>
        <Card className={classes.card}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{ fontFamily: "Roboto condensed", color: "gray" }}
              variant="h5"
            >
              Unpaid Invoices
            </Typography>
            <Typography variant="h6">{unpaidInvoice.length}</Typography>
          </div>
          <SentimentDissatisfiedOutlinedIcon color="error" />
        </Card>
        <Card className={classes.card}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{ fontFamily: "Roboto condensed", color: "gray" }}
              variant="h5"
            >
              Overdue
            </Typography>
            <Typography variant="h6">{overDue.length}</Typography>
          </div>
          <AccessTimeOutlinedIcon color="error" />
        </Card>
      </section>

      {paymentHistory.length !== 0 && (
        <section>
          <Chart paymentHistory={paymentHistory} />
        </section>
      )}

      <section>
        <Typography
          sx={{ textAlign: "center", padding: "30px", fontFamily: "Aladin" }}
          variant="h3"
        >
          {paymentHistory.length
            ? "Recent Payments"
            : "No payment received yet"}
        </Typography>

        <div className="paymenttable">
          <TableContainer component={Paper}>
            <Table aria-label="custom pagination table">
              <TableBody>
                {paymentHistory.length !== 0 && (
                  <TableRow>
                    <TableCell style={{ padding: "15px" }}></TableCell>
                    <TableCell style={{ padding: "15px" }}>Paid By</TableCell>
                    <TableCell style={{ padding: "15px" }}>Date Paid</TableCell>
                    <TableCell style={{ padding: "15px" }}>
                      Amount Paid
                    </TableCell>
                    <TableCell style={{ padding: "15px" }}>
                      Payment Method
                    </TableCell>
                    <TableCell style={{ padding: "15px" }}>Note</TableCell>
                  </TableRow>
                )}

                {sortHistoryByDate.slice(-10).map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>
                      <Avatar>{record.paidBy.charAt(0)}</Avatar>
                    </TableCell>
                    <TableCell>{record.paidBy}</TableCell>
                    <TableCell>
                      {moment(record.datePaid).format("MMMM Do YYYY")}
                    </TableCell>
                    <TableCell>
                      <h3 style={{ color: "#00A86B", fontSize: "14px" }}>
                        {toCommas(record.amountPaid)}
                      </h3>
                    </TableCell>
                    <TableCell>{record.paymentMethod}</TableCell>
                    <TableCell>{record.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </section>
    </Box>
  );
}

function Nodata() {
  return (
    <Box
      sx={{
        width: {
          sm: `calc(100% - ${drawerWidth}px)`,
          xs: `100%`,
        },
        ml: { sm: `${drawerWidth}px`, xs: 0 },
        backgroundColor: "#a7e7e5",
        padding: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          paddingTop: "20px",
          margin: "80px",
        }}
      >
        <Typography variant="h3">
          Goto settings and complete your profile.
        </Typography>
        <p style={{ padding: "40px", color: "gray", textAlign: "center" }}>
          Nothing to display.Create your first invoice by clicing create invoice
        </p>
      </div>
    </Box>
  );
}
