import { Box, Button, Typography, TextField } from "@mui/material";
import { drawerWidth } from "../AppBar/Sidebar.js";
import { Container, Grid, InputBase, Divider } from "@mui/material";
import logo1 from "../../assets/logo1.png";
import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { API_URL } from "../../globalconstant.js";
import currencies from "../../currencies.json";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment";
import SaveIcon from "@mui/icons-material/Save";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { MenuItem, Select } from "@mui/material";
import { useHistory } from "react-router-dom";
import { initialState, toCommas } from "../../initialState.js";

export function Addinvoice() {
  const history = useHistory();
  const user = localStorage.getItem("Username");
  const company = JSON.parse(localStorage.getItem("user"));
  const [invoiceData, setInvoiceData] = useState(initialState);
  const [customers, setcustomers] = useState("");
  const [customer, setcustomer] = useState("");
  const [rates, setRates] = useState(0);
  const [vat, setVat] = useState(0);
  const [type, setType] = useState(initialState.type);
  const [status, setStatus] = useState("");
  const [currency, setCurrency] = useState(currencies[0].value);
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(
    today.getTime() + 7 * 24 * 60 * 60 * 1000
  );
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
  // console.log(customers);
  const handleAddField = (e) => {
    e.preventDefault();
    setInvoiceData((prevState) => ({
      ...prevState,
      items: [
        ...prevState.items,
        { itemName: "", unitPrice: "", quantity: "", discount: "", amount: "" },
      ],
    }));
  };

  const handleRemoveField = (index) => {
    const values = invoiceData.items;
    values.splice(index, 1);
    setInvoiceData((prevState) => ({ ...prevState, values }));
    // console.log(values)
  };
  const handleChange = (index, e) => {
    const values = [...invoiceData.items];
    values[index][e.target.name] = e.target.value;
    setInvoiceData({ ...invoiceData, items: values });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date.toISOString());
  };

  const handleRates = (e) => {
    setRates(e.target.value);
    setInvoiceData((prevState) => ({ ...prevState, tax: e.target.value }));
  };

  // console.log(invoiceData)
  // Change handler for dynamically added input field
  useEffect(() => {
    //Get the subtotal
    const subTotal = () => {
      var arr = document.getElementsByName("amount");
      var subtotal = 0;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].value) {
          subtotal += +arr[i].value;
        }
        // document.getElementById("subtotal").value = subtotal;
        setSubTotal(subtotal);
      }
    };

    subTotal();
  }, [invoiceData]);
  useEffect(() => {
    if (type === "Receipt") {
      setStatus("Paid");
    } else {
      setStatus("Unpaid");
    }
  }, [type]);
  useEffect(() => {
    const total = () => {
      //Tax rate is calculated as (input / 100 ) * subtotal + subtotal
      const overallSum = (rates / 100) * subTotal + subTotal;
      //VAT is calculated as tax rates /100 * subtotal
      setVat(Math.round((rates / 100) * subTotal));
      setTotal(overallSum);
    };
    total();
  }, [invoiceData, rates, subTotal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...invoiceData,
      subTotal: subTotal,
      total: total,
      vat: vat,
      rates: rates,
      currency: currency,
      dueDate: selectedDate,
      customer,
      type: type,
      status: status,
      paymentRecords: [],
      creator: user,
      company: company,
    };
    fetch(`${API_URL}/invoices/createinvoice`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => data.json())
      .then((x) => {
        history.push(`/invoices/${x._id}`);
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
      <Typography sx={{ fontFamily: "Aladin" }} variant="h4">
        Create Invoice
      </Typography>
      <div className="page">
        <form onSubmit={handleSubmit}>
          <Container>
            <Grid container justifyContent="space-between">
              <Grid item>
                <img
                  alt="Logo"
                  variant="square"
                  src={logo1}
                  className="logos"
                />
              </Grid>
              <Grid item>
                <div>
                  <Select
                    labelId="demo-dialog-select-label"
                    id="demo-dialog-select"
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                    // input={<Input />}
                    autoWidth
                  >
                    <MenuItem value="">
                      <em>Select Type</em>
                    </MenuItem>
                    <MenuItem value="Invoice">Invoice</MenuItem>
                    <MenuItem value="Receipt">Receipt</MenuItem>
                  </Select>
                </div>
                <Typography variant="overline" style={{ color: "gray" }}>
                  Invoice#:{" "}
                </Typography>
                <InputBase defaultValue={invoiceData.invoiceNumber} />
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
              <Grid item style={{ width: "50%" }}>
                <Container>
                  <Typography
                    variant="overline"
                    style={{ color: "gray", paddingRight: "3px" }}
                    gutterBottom
                  >
                    Bill to
                  </Typography>
                  {customer && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        {customer.customerName}
                      </Typography>
                      <Typography variant="body2">{customer.email}</Typography>
                      <Typography variant="body2">
                        {customer.phoneno}
                      </Typography>
                      <Typography variant="body2">
                        {customer.address}
                      </Typography>
                      <Button
                        color="primary"
                        size="small"
                        style={{ textTransform: "none" }}
                        onClick={() => setcustomer("")}
                      >
                        Change
                      </Button>
                    </>
                  )}
                  <div
                    style={
                      customer ? { display: "none" } : { display: "block" }
                    }
                  >
                    <Autocomplete
                      id="combo-box-demo"
                      sx={{ width: "auto" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required={true}
                          label="Select Customer"
                          margin="normal"
                          variant="outlined"
                        />
                      )}
                      options={customers}
                      getOptionLabel={(option) => option.customerName}
                      onChange={(event, value) => setcustomer(value)}
                    />
                  </div>
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
                  sx={{ color: type === "Receipt" ? "green" : "red" }}
                >
                  {type === "Receipt" ? "Paid" : "Unpaid"}
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
                    ? moment(selectedDate).toISOString()
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

          <div>
            <TableContainer component={Paper} className="tb-container">
              <Table className="invoicetable" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Disc(%)</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceData.items.map((itemField, index) => (
                    <TableRow key={index}>
                      <TableCell scope="row" style={{ width: "40%" }}>
                        {" "}
                        <InputBase
                          style={{ width: "100%" }}
                          outline="none"
                          sx={{ ml: 1, flex: 1 }}
                          type="text"
                          name="itemName"
                          onChange={(e) => handleChange(index, e)}
                          value={itemField.itemName}
                          placeholder="Item name or description"
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="quantity"
                          onChange={(e) => handleChange(index, e)}
                          value={itemField.quantity}
                          placeholder="0"
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="unitPrice"
                          onChange={(e) => handleChange(index, e)}
                          value={itemField.unitPrice}
                          placeholder="0"
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="discount"
                          onChange={(e) => handleChange(index, e)}
                          value={itemField.discount}
                          placeholder="0"
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="amount"
                          onChange={(e) => handleChange(index, e)}
                          value={
                            itemField.quantity * itemField.unitPrice -
                            (itemField.quantity *
                              itemField.unitPrice *
                              itemField.discount) /
                              100
                          }
                          disabled
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        <Button onClick={() => handleRemoveField(index)}>
                          <DeleteRoundedIcon
                            style={{ width: "20px", height: "20px" }}
                            color="error"
                          />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="addButton">
              <Button onClick={handleAddField}>
                <AddCircleRoundedIcon
                  style={{ width: "20px", height: "20px" }}
                  color="success"
                />
              </Button>
            </div>
          </div>
          <div className="invoiceSummary">
            <div className="summary">Invoice Summary</div>
            <div className="summaryItem">
              <Typography variant="p">Sub total:</Typography>
              <Typography variant="h4">{subTotal}</Typography>
            </div>
            <div className="summaryItem">
              <Typography variant="p">VAT(%):</Typography>
              <Typography variant="h4">{vat}</Typography>
            </div>
            <div className="summaryItem">
              <Typography>Total</Typography>
              <Typography
                variant="h4"
                sx={{ color: "black", fontSize: "18px", lineHeight: "8px" }}
              >
                {currency} {toCommas(total)}
              </Typography>
            </div>
          </div>

          <div className="toolBar">
            <Container>
              <Grid container>
                <Grid item style={{ marginTop: "16px", marginRight: 10 }}>
                  <TextField
                    type="text"
                    step="any"
                    name="rates"
                    id="rates"
                    value={rates}
                    onChange={handleRates}
                    placeholder="e.g 10"
                    label="Tax Rates(%)"
                  />
                </Grid>
                <Grid item style={{ margin: 10 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      renderInput={(params) => <TextField {...params} />}
                      id="date-picker-dialog"
                      openTo="year"
                      views={["year", "month", "day"]}
                      label="Due date"
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item style={{ width: 270, marginRight: 10 }}>
                  <Autocomplete
                    id="debug"
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select currency"
                        margin="normal"
                      />
                    )}
                    options={currencies}
                    onChange={(event, value) => setCurrency(value.value)}
                  />
                </Grid>
              </Grid>
            </Container>
          </div>
          <div className="note">
            <h4>Notes/Terms</h4>
            <textarea
              placeholder="Provide additional details or terms of service"
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, notes: e.target.value })
              }
              value={invoiceData.notes}
            />
          </div>

          {/* <button className={styles.submitButton} type="submit">Save and continue</button> */}
          <Grid container justifyContent="center">
            <Button
              variant="contained"
              style={{ justifyContentContent: "center" }}
              type="submit"
              color="primary"
              size="large"
              className="button"
              startIcon={<SaveIcon />}
            >
              Save and Continue
            </Button>
          </Grid>
        </form>
      </div>
    </Box>
  );
}
