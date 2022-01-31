import { Redirect, Switch, Route } from "react-router-dom";
import "./App.css";
import { Login } from "./components/Authenication/Login.js";
import { Signup } from "./components/Authenication/Signup.js";
import { ForgotPassword } from "./components/Authenication/Forgotpassword.js";
import { ResetPassword } from "./components/Authenication/Resetpassword.js";
import { useParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { Sidebar } from "./components/AppBar/Sidebar.js";
import { API_URL } from "./globalconstant.js";
import { Addcustomer } from "./components/Customers/Addcustomer";
import { NavBar } from "./components/AppBar/Navbar.js";
import { Customerlist } from "./components/Customers/CustomerList.js";
import { Editcustomer } from "./components/Customers/Editcustomer.js";
import { Addinvoice } from "./components/Invoices/Addinvoice.js";
import { Invoicedetails } from "./components/Invoices/Invoicedetails.js";
import { Invoices } from "./components/Invoices/Invoices.js";
import { EditInvoice } from "./components/Invoices/EditInvoice.js";
import { Settings } from "./components/Settings/Settings.js";
import { Dashboard } from "./components/Dashboard/Dashboard.js";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";

export default function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/forgotpassword">
          <ForgotPassword />
        </Route>
        <Route exact path="/forgotpassword/verify/:id">
          <Changepass />
        </Route>
        <Route exact path="/resetpassword/:id">
          <ResetPassword />
        </Route>
        <>
          <Paper
            elevation={0}
            style={{ borderStyle: "none", minHeight: "100vh" }}
          >
            {/* works on condition */}
            <Sidebar />
            <NavBar />
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>
            <Route exact path="/settings">
              <Settings />
            </Route>
            <Route exact path="/createcustomer">
              <Addcustomer />
            </Route>
            <Route exact path="/customerlist">
              <Customerlist />
            </Route>
            <Route exact path="/customer/edit/:id">
              <Editcustomer />
            </Route>
            <Route exact path="/create invoices">
              <Addinvoice />
            </Route>
            <Route exact path="/invoices/:id">
              <Invoicedetails />
            </Route>
            <Route exact path="/invoice/edit/:id">
              <EditInvoice />
            </Route>
            <Route exact path="/invoices">
              <Invoices />
            </Route>
          </Paper>
        </>
      </Switch>
    </div>
  );
}

function Changepass() {
  const { id } = useParams();
  // console.log(id);
  return id ? <Updatepassword id={id} /> : null;
}
// updatpassword
function Updatepassword({ id }) {
  // const { history } = useHistory();
  // console.log(id);
  const Result = (id) => {
    fetch(`${API_URL}/users/forgotpassword/verify`, {
      method: "GET",
      headers: { "x-auth-token": id },
    })
      .then((response) => {
        const Status = response.status;
        return Status;
      })
      .then((Status) =>
        Status === 200
          ? window.location.replace(`/resetpassword/${id}`)
          : alert("Please enter the registered email")
      );
  };

  Result(id);

  // Loading Page
  return (
    <div
      className="loader-container"
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="success" />
      <Typography sx={{ fontFamily: "Aladin" }} variant="h6">
        Please Wait......
      </Typography>
    </div>
  );
}
