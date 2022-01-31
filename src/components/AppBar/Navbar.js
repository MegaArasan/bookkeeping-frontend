import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { drawerWidth } from "./Sidebar.js";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import logo1 from "../../assets/logo1.png";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ViewListIcon from "@mui/icons-material/ViewList";
import CreateIcon from "@mui/icons-material/Create";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Divider from "@mui/material/Divider";
import { useHistory } from "react-router-dom";

export function NavBar() {
  const history = useHistory();
  const [show, setshow] = useState(false);
  const [Name] = useState(null);
  const handleDrawerOpen = () => {
    setshow(true);
  };
  const handleDrawerClose = () => {
    setshow(false);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <AppBar
        position="static"
        sx={{
          width: {
            sm: `calc(100% - ${drawerWidth}px)`,
            xs: `100%`,
          },
          ml: { sm: `${drawerWidth}px`, xs: 0 },
          backgroundColor: "#7c8187fc",
        }}
      >
        <Toolbar variant="dense">
          <IconButton
            sx={{ display: { xs: "block", sm: "none" } }}
            onClick={handleDrawerOpen}
            color="inherit"
            aria-label="menuicon"
          >
            <MenuIcon />
          </IconButton>
          {/* for mobile version */}
          <Drawer
            sx={{
              width: "200px",
              height: "100%",
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: "200px",
                height: "100%",
                boxSizing: "border-box",
                backgroundColor: "#1976d2",
                color: "white",
              },
            }}
            anchor="left"
            open={show}
          >
            {/* for closing swipable drawer  */}
            <IconButton
              color="inherit"
              aria-label="close"
              component="span"
              onClick={handleDrawerClose}
              sx={{ ml: "auto" }}
            >
              <CloseIcon />
            </IconButton>
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
          {/* <div style={{ display: { xs: "block", sm: "none" } }}> */}
          <img src={logo1} alt="logo" className="logo1" />
          <Typography
            sx={{
              fontFamily: "Aladin",
              fontSize: "26px",
              color: "inherit",
              display: { xs: "block", sm: "none" },
            }}
            variant="p"
          >
            Book Invoice
          </Typography>
          {/* </div> */}

          <IconButton
            sx={{ marginLeft: "auto" }}
            className="avatar"
            onClick={handleClick}
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              alt={Name ? Name : localStorage.getItem("Username")}
              src=""
            />
          </IconButton>
          {/* Popup Menu */}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ "aria-labelledby": "basic-button" }}
          >
            <MenuItem>
              <Typography>
                {Name ? Name : localStorage.getItem("Username")}
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => history.push("/settings")}>
              Settings
            </MenuItem>
            <MenuItem
              onClick={() => {
                localStorage.clear();
                window.location.reload(false);
                window.location.href = "/";
              }}
            >
              Log Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}
