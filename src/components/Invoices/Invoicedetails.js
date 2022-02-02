import * as React from "react";
import MuiAlert from "@mui/material/Alert";
import { Box, Button, Typography } from "@mui/material";
import { drawerWidth } from "../AppBar/Sidebar.js";
import { useState, useEffect } from "react";
import { API_URL } from "../../globalconstant.js";
import { toCommas } from "../../initialState.js";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useHistory, useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { Container, Grid, InputBase, Divider } from "@mui/material";
import { PaymentHistory } from "./PaymentHistory.js";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import Paper from "@mui/material/Paper";
import Modal from "./Modal.js";
import { saveAs } from "file-saver";

export function Invoicedetails() {
  const [invoiceData, setInvoiceData] = useState();
  const [rates, setRates] = useState(0);
  const [vat, setVat] = useState(0);
  const [currency, setCurrency] = useState("");
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customer, setcustomer] = useState([]);
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const { id } = useParams();
  const [company, setCompany] = useState({});
  // console.log(id);
  useEffect(() => {
    fetch(`${API_URL}/invoices/getinvoice/${id}`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((invoice) => {
        // console.log(invoice, "Start");
        setInvoiceData(invoice);
        setRates(invoice.rates);
        setcustomer(invoice.customer);
        setType(invoice.type);
        setStatus(invoice.status);
        setSelectedDate(invoice.dueDate);
        setVat(invoice.vat);
        setCurrency(invoice.currency);
        setSubTotal(invoice.subTotal);
        setTotal(invoice.total);
        setCompany(invoice.company);
      });
  }, [id]);

  return invoiceData ? (
    <InvoiceDetails
      invoiceData={invoiceData}
      rates={rates}
      vat={vat}
      currency={currency}
      subTotal={subTotal}
      total={total}
      selectedDate={selectedDate}
      customer={customer}
      type={type}
      status={status}
      id={id}
      company={company}
    />
  ) : (
    ""
  );
}
function InvoiceDetails({
  invoiceData,
  rates,
  vat,
  currency,
  subTotal,
  total,
  selectedDate,
  customer,
  type,
  status,
  id,
  company,
}) {
  const [loading, setLoading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line
  const [opened, setopened] = useState(false);
  // console.log(id);
  // const userName = localStorage.getItem("Username");
  const [Msg, setMsg] = useState();
  const history = useHistory();
  const createdAt = new Date().toISOString().slice(0, 10);
  let totalAmountReceived = 0;
  for (var i = 0; i < invoiceData?.paymentRecords?.length; i++) {
    totalAmountReceived += Number(invoiceData?.paymentRecords[i]?.amountPaid);
  }
  const editInvoice = (id) => {
    // console.log(id);
    history.push(`/invoice/edit/${id}`);
  };

  const createAndDownloadPdf = () => {
    setDownloadStatus("loading");
    const data = {
      name: invoiceData.customer.customerName,
      address: invoiceData.customer.address,
      phone: invoiceData.customer.phoneno,
      email: invoiceData.customer.email,
      dueDate: invoiceData.dueDate,
      date: createdAt,
      id: invoiceData.invoiceNumber,
      notes: invoiceData.notes,
      subTotal: toCommas(invoiceData.subTotal),
      total: toCommas(invoiceData.total),
      type: invoiceData.type,
      vat: invoiceData.vat,
      items: invoiceData.items,
      status: invoiceData.status,
      totalAmountReceived: toCommas(totalAmountReceived),
      balanceDue: toCommas(total - totalAmountReceived),
      company: company,
    };
    // console.log(data);
    fetch(`${API_URL}/invoices/createanddownloadpdf`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then(() =>
        fetch(`${API_URL}/invoices/fetch-pdf`, {
          method: "GET",
        })
      )
      .then((res) => res.blob())
      .then((myblob) => {
        // console.log(myblob);
        const pdfBlob = new Blob([myblob.data], { type: "application/pdf" });
        saveAs(pdfBlob, "Invoice.pdf");
      })
      .then(() => setDownloadStatus("success"))
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  const sendPdf = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name: invoiceData.customer.customerName,
      address: invoiceData.customer.address,
      phone: invoiceData.customer.phoneno,
      email: invoiceData.customer.email,
      dueDate: invoiceData.dueDate,
      date: createdAt,
      id: invoiceData.invoiceNumber,
      notes: invoiceData.notes,
      subTotal: toCommas(invoiceData.subTotal),
      total: toCommas(invoiceData.total),
      type: invoiceData.type,
      vat: invoiceData.vat,
      items: invoiceData.items,
      status: invoiceData.status,
      totalAmountReceived: toCommas(totalAmountReceived),
      balanceDue: toCommas(total - totalAmountReceived),
      company: company,
    };
    fetch(`${API_URL}/invoices/send-pdf`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        console.log("invoice sent successfully");
        setLoading(false);
        setopened(true);
        setMsg("Invoice sent successfully");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  function checkStatus() {
    return totalAmountReceived >= total
      ? "green"
      : status === "Partial"
      ? "#1976d2"
      : status === "Paid"
      ? "green"
      : status === "Unpaid"
      ? "red"
      : "red";
  }
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
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
      <div>
        <Grid container justifyContent="space-between" spacing={2} padding={1}>
          <Button
            sx={{ margin: "2px" }}
            onClick={sendPdf}
            disabled={loading}
            variant="contained"
          >
            Send to Customer
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: "green",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Button>
          <Button
            sx={{ margin: "2px" }}
            onClick={createAndDownloadPdf}
            variant="contained"
            state={downloadStatus}
          >
            Download PDF
          </Button>
          <Button
            sx={{ margin: "2px" }}
            onClick={() => editInvoice(id)}
            variant="contained"
          >
            <BorderColorIcon />
            Edit Invoice
          </Button>
          <Button
            sx={{ margin: "2px" }}
            onClick={() => setOpen((prev) => !prev)}
            variant="contained"
          >
            <MonetizationOnIcon />
            Record Payment
          </Button>
        </Grid>

        {invoiceData.paymentRecords.length !== 0 ? (
          <PaymentHistory paymentRecords={invoiceData.paymentRecords} />
        ) : (
          ""
        )}

        <Modal
          open={open}
          setOpen={setOpen}
          invoiceData={invoiceData}
          setMsg={setMsg}
          id={id}
        />
        <div className="page">
          <Container>
            <Grid
              container
              justifyContent="space-between"
              style={{ padding: "30px 0px" }}
            >
              <Grid
                item
                onClick={() => history.push("/settings")}
                style={{ cursor: "pointer" }}
              >
                {company.logo ? (
                  <>
                    <img
                      src={company.logo}
                      alt="Logo"
                      className="companylogo"
                    />
                    <Typography variant="h6">{company.businessName}</Typography>
                  </>
                ) : (
                  ""
                )}
              </Grid>

              <Grid item style={{ marginRight: 40, textAlign: "right" }}>
                <Typography
                  style={{
                    lineSpacing: 1,
                    fontSize: 45,
                    fontWeight: 700,
                    color: "gray",
                  }}
                >
                  {Number(total - totalAmountReceived) <= 0 ? "Receipt" : type}
                </Typography>
                <Typography variant="overline" style={{ color: "gray" }}>
                  No:{" "}
                </Typography>
                <Typography variant="body2">
                  {invoiceData.invoiceNumber}
                </Typography>
              </Grid>
            </Grid>
          </Container>
          <Divider />
          <Container>
            <Grid
              container
              justifyContent="space-between"
              style={{ marginTop: "40px" }}
            >
              <Grid item>
                {invoiceData.company && (
                  <Container style={{ marginBottom: "20px" }}>
                    <Typography
                      variant="overline"
                      style={{ color: "gray" }}
                      gutterBottom
                    >
                      From
                    </Typography>
                    <Typography variant="subtitle2">
                      {company.businessName}
                    </Typography>
                    <Typography variant="body2">{company.email}</Typography>
                    <Typography variant="body2">{company.phoneno}</Typography>
                    <Typography variant="body2" gutterBottom>
                      {company.contactAddress}
                    </Typography>
                  </Container>
                )}
                <Container>
                  <Typography
                    variant="overline"
                    style={{ color: "gray", paddingRight: "3px" }}
                    gutterBottom
                  >
                    Bill to
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    {customer.customerName}
                  </Typography>
                  <Typography variant="body2">{customer.email}</Typography>
                  <Typography variant="body2">{customer.phoneno}</Typography>
                  <Typography variant="body2">{customer.address}</Typography>
                </Container>
              </Grid>
              <Grid item style={{ marginRight: 20, textAlign: "right" }}>
                <Typography
                  variant="overline"
                  style={{ color: "gray" }}
                  gutterBottom
                >
                  Status
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ color: checkStatus() }}
                >
                  {totalAmountReceived >= total ? "Paid" : status}
                </Typography>
                <Typography
                  variant="overline"
                  style={{ color: "gray" }}
                  gutterBottom
                >
                  Date
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {moment().format("MMM Do YYYY")}
                </Typography>
                <Typography
                  variant="overline"
                  style={{ color: "gray" }}
                  gutterBottom
                >
                  Due Date
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {selectedDate
                    ? moment(selectedDate).format("MMM Do YYYY")
                    : "27th Sep 2021"}
                </Typography>
                <Typography variant="overline" gutterBottom>
                  Amount
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {currency} {toCommas(total)}
                </Typography>
              </Grid>
            </Grid>
          </Container>
          <form>
            <div>
              <TableContainer component={Paper}>
                <Table className={"table"} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Disc(%)</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceData?.items?.map((itemField, index) => (
                      <TableRow key={index}>
                        <TableCell scope="row" style={{ width: "40%" }}>
                          {" "}
                          <InputBase
                            style={{ width: "100%" }}
                            outline="none"
                            sx={{ ml: 1, flex: 1 }}
                            type="text"
                            name="itemName"
                            value={itemField.itemName}
                            placeholder="Item name or description"
                            readOnly
                          />{" "}
                        </TableCell>
                        <TableCell align="right">
                          {" "}
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            type="number"
                            name="quantity"
                            value={itemField?.quantity}
                            placeholder="0"
                            readOnly
                          />{" "}
                        </TableCell>
                        <TableCell align="right">
                          {" "}
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            type="number"
                            name="unitPrice"
                            value={itemField?.unitPrice}
                            placeholder="0"
                            readOnly
                          />{" "}
                        </TableCell>
                        <TableCell align="right">
                          {" "}
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            type="number"
                            name="discount"
                            value={itemField?.discount}
                            readOnly
                          />{" "}
                        </TableCell>
                        <TableCell align="right">
                          {" "}
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            type="number"
                            name="amount"
                            value={
                              itemField?.quantity * itemField.unitPrice -
                              (itemField.quantity *
                                itemField.unitPrice *
                                itemField.discount) /
                                100
                            }
                            readOnly
                          />{" "}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className={"addButton"}></div>
            </div>
            <div className={"invoiceSummary"}>
              <div className={"summary"}>Invoice Summary</div>
              <div className={"summaryItem"}>
                <p>Subtotal:</p>
                <h4>{subTotal}</h4>
              </div>
              <div className={"summaryItem"}>
                <p>{`VAT(${rates}%):`}</p>
                <h4>{vat}</h4>
              </div>
              <div className={"summaryItem"}>
                <p>Total</p>
                <h4>
                  {currency} {toCommas(total)}
                </h4>
              </div>
              <div className={"summaryItem"}>
                <p>Paid</p>
                <h4>
                  {currency} {toCommas(totalAmountReceived)}
                </h4>
              </div>
              <div className={"summaryItem"}>
                <p>Balance</p>
                <h4
                  style={{
                    color: "black",
                    fontSize: "18px",
                    lineHeight: "8px",
                  }}
                >
                  {currency} {toCommas(total - totalAmountReceived)}
                </h4>
              </div>
            </div>
            <div className="note">
              <h4>Notes/Terms</h4>
              <Typography>{invoiceData.notes}</Typography>
            </div>
            {/* <button className={styles.submitButton} type="submit">Save and continue</button> */}
          </form>
        </div>
      </div>
      <Snackbar onClose={handleClose} open={opened} autoHideDuration={1000}>
        <Alert severity="success" sx={{ width: "100%" }}>
          {Msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
