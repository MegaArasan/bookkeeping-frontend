import * as React from "react";
import { drawerWidth } from "../AppBar/Sidebar.js";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { API_URL } from "../../globalconstant.js";
import { useHistory } from "react-router-dom";
import moment from "moment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const tableStyle = {
  width: 160,
  fontSize: 14,
  cursor: "pointer",
  borderBottom: "none",
  padding: "8px",
  textAlign: "center",
};

export function Invoices() {
  const [rows, setrows] = React.useState();
  const history = useHistory();
  const username = localStorage.getItem("Username");
  const id=localStorage.getItem("token");

  // console.log(username);
  const getinvoices = () => {
    fetch(`${API_URL}/invoices/getall`, {
      method: "GET",
      headers: { "x-auth-token": id },
    })
      .then((data) => data.json())
      .then((invoices) => {
        // console.log(invoices);
        setrows(invoices);
        });
  };
  React.useEffect(getinvoices, [id]);
  if (!username) {
    history.push("/");
  }
  return rows ? <InvoicesList rows={rows} /> : <Nodata />;
}

function InvoicesList({ rows }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [Msg, setMsg] = React.useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const editInvoice = (id) => {
    history.push(`/invoice/edit/${id}`);
  };

  const openInvoice = (id) => {
    history.push(`/invoices/${id}`);
  };
  const toCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  function checkStatus(status) {
    return status === "Partial"
      ? {
          border: "solid 0px #1976d2",
          backgroundColor: "#baddff",
          padding: "8px 18px",
          borderRadius: "20px",
        }
      : status === "Paid"
      ? {
          border: "solid 0px green",
          backgroundColor: "#a5ffcd",
          padding: "8px 18px",
          borderRadius: "20px",
        }
      : status === "Unpaid"
      ? {
          border: "solid 0px red",
          backgroundColor: "#ffaa91",
          padding: "8px 18px",
          borderRadius: "20px",
        }
      : "red";
  }
  const deleteInvoice = (id) => {
    // console.log(id);
    fetch(`${API_URL}/invoices/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 200) {
          setMsg({ msg: "Invoice deleted Successfully", status: "success" });
          setOpen(true);
        }
      })
      .catch((err) => {
        setMsg({ msg: err.msg, status: "error" });
        setOpen(true);
      });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
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
        padding: "10px",
      }}
    >
      <Typography variant="h3" sx={{ fontFamily: "Aladin" }}>
        Invoice List
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell style={{ borderBottom: "none", textAlign: "center" }}>
                Number
              </TableCell>
              <TableCell style={{ borderBottom: "none", textAlign: "center" }}>
                Client
              </TableCell>
              <TableCell style={{ borderBottom: "none", textAlign: "center" }}>
                Amount
              </TableCell>
              <TableCell style={{ borderBottom: "none", textAlign: "center" }}>
                Due Date
              </TableCell>
              <TableCell style={{ borderBottom: "none", textAlign: "center" }}>
                Status
              </TableCell>
              <TableCell style={{ borderBottom: "none", textAlign: "center" }}>
                Edit
              </TableCell>
              <TableCell style={{ borderBottom: "none", textAlign: "center" }}>
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <TableRow key={row._id} style={{ cursor: "pointer" }}>
                <TableCell
                  style={tableStyle}
                  onClick={() => openInvoice(row._id)}
                >
                  {" "}
                  {row.invoiceNumber}{" "}
                </TableCell>
                <TableCell
                  style={tableStyle}
                  onClick={() => openInvoice(row._id)}
                >
                  {" "}
                  {row.customer.customerName}{" "}
                </TableCell>
                <TableCell
                  style={tableStyle}
                  onClick={() => openInvoice(row._id)}
                >
                  {row.currency} {row.total ? toCommas(row.total) : row.total}{" "}
                </TableCell>
                <TableCell
                  style={tableStyle}
                  onClick={() => openInvoice(row._id)}
                >
                  {" "}
                  {moment(row.dueDate).fromNow()}{" "}
                </TableCell>
                <TableCell
                  style={tableStyle}
                  onClick={() => openInvoice(row._id)}
                >
                  {" "}
                  <button style={checkStatus(row.status)}>{row.status}</button>
                </TableCell>

                <TableCell style={{ ...tableStyle, width: "10px" }}>
                  <IconButton onClick={() => editInvoice(row._id)}>
                    <EditIcon style={{ width: "20px", height: "20px" }} />
                  </IconButton>
                </TableCell>
                <TableCell style={{ ...tableStyle, width: "10px" }}>
                  <IconButton onClick={() => deleteInvoice(row._id)}>
                    <DeleteIcon style={{ width: "20px", height: "20px" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={6}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
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

function Nodata() {
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
        <p style={{ padding: "40px", color: "gray", textAlign: "center" }}>
          No invoice yet.Create your first invoice by clicing create invoice
        </p>
      </div>
    </Box>
  );
}
