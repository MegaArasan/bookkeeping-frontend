import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import logo1 from "../../assets/logo1.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ViewListIcon from "@mui/icons-material/ViewList";
import CreateIcon from "@mui/icons-material/Create";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useHistory } from "react-router-dom";

export const drawerWidth = 230;

export function Sidebar() {
  const history = useHistory();
  return (
    <Drawer
      sx={{
        display: { xs: "none", sm: "block" },
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#1976d2",
          color: "white",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <img src={logo1} alt="logo" className="logo" />
        <Typography sx={{ fontFamily: "Aladin", fontSize: "26px" }} variant="p">
          Book Invoice
        </Typography>
      </Toolbar>
      <Divider />
      <Button
        startIcon={<DashboardIcon />}
        color="inherit"
        onClick={() => history.push("/dashboard")}
      >
        Dashboard
      </Button>
      <Divider />
      <Typography variant="caption" display="block" gutterBottom>
        Customers
      </Typography>
      <Button
        startIcon={<PersonAddIcon />}
        color="inherit"
        onClick={() => history.push("/createcustomer")}
      >
        Add Customer
      </Button>
      <Button
        startIcon={<ViewListIcon />}
        color="inherit"
        onClick={() => history.push("/customerlist")}
      >
        Customers List
      </Button>
      <Divider />
      <Typography variant="caption" display="block" gutterBottom>
        Invoices
      </Typography>
      <Button
        startIcon={<CreateIcon />}
        color="inherit"
        onClick={() => history.push("/create invoices")}
      >
        Create Invoice
      </Button>
      <Button
        onClick={() => history.push("/invoices")}
        startIcon={<ReceiptIcon />}
        color="inherit"
      >
        Invoices
      </Button>
    </Drawer>
  );
}
