/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Button, IconButton, Typography, TextField, Grid } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { API_URL } from "../../globalconstant.js";

const Modal = ({ setMsg, setOpen, open, invoiceData, id }) => {
  //Create a state to add new payment record
  const [payment, setPayment] = useState({
    amountPaid: 0,
    datePaid: new Date(),
    paymentMethod: "",
    note: "",
    paidBy: "",
  });
  // console.log(id);
  // console.log(invoiceData);
  const [selectedDate, setSelectedDate] = useState(new Date());
  //Crate a state to handle the payment records
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [method, setMethod] = useState({});
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [updatedInvoice, setUpdatedInvoice] = useState({});

  useEffect(() => {
    setPayment({ ...payment, paymentMethod: method.title });
  }, [method]);

  useEffect(() => {
    setPayment({ ...payment, datePaid: selectedDate });
  }, [selectedDate]);

  useEffect(() => {
    if (invoiceData) {
      setPayment({
        ...payment,
        amountPaid:
          Number(invoiceData.total) - Number(invoiceData.totalAmountReceived),
        paidBy: invoiceData.customer.customerName,
      });
    }
  }, [invoiceData]);

  useEffect(() => {
    if (invoiceData.paymentRecords) {
      setPaymentRecords(invoiceData.paymentRecords);
    }
  }, [invoiceData]);

  //Get the total amount paid
  useEffect(() => {
    let totalReceived = 0;
    for (var i = 0; i < invoiceData.paymentRecords.length; i++) {
      totalReceived += Number(invoiceData.paymentRecords[i].amountPaid);
      setTotalAmountReceived(totalReceived);
    }
  }, [invoiceData, payment]);

  useEffect(() => {
    setUpdatedInvoice({
      ...invoiceData,
      status:
        Number(totalAmountReceived) + Number(payment.amountPaid) >=
        invoiceData?.total
          ? "Paid"
          : "Partial",
      paymentRecords: [...paymentRecords, payment],
      totalAmountReceived:
        Number(totalAmountReceived) + Number(payment.amountPaid),
    });
  }, [payment, paymentRecords, totalAmountReceived, invoiceData]);

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    // console.log(updatedInvoice);
    fetch(`${API_URL}/invoices/updateinvoice/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedInvoice),
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      setMsg("Payment updated successfully");
      setOpen(false);
      window.location.reload();
    });
  };
  const handleDateChange = (date) => {
    setSelectedDate(date.toISOString());
  };

  const paymentMethods = [
    { title: "Bank Transfer" },
    { title: "Cash" },
    { title: "Credit Card" },
    { title: "PayPal" },
    { title: "Others" },
  ];

  return (
    <div>
      <form>
        <Dialog
          onClose={() => setOpen(false)}
          aria-labelledby="customized-dialog-title"
          open={open}
          fullWidth
        >
          <DialogTitle
            id="customized-dialog-title"
            style={{ paddingLeft: "20px", color: "inherit" }}
          >
            Record Payment
          </DialogTitle>
          <DialogContent dividers>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Paid Date"
                value={selectedDate}
                variant="outline"
                format="MM/dd/yyyy"
                margin="normal"
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <TextField
              type="number"
              name="amountPaid"
              label="Amount Paid"
              style={{ padding: 10 }}
              variant="outlined"
              onChange={(e) =>
                setPayment({ ...payment, amountPaid: e.target.value })
              }
              value={payment.amountPaid}
            />

            <Grid item>
              <Autocomplete
                id="combo-box-demo"
                options={paymentMethods}
                getOptionLabel={(option) => option.title}
                onChange={(event, value) => setMethod(value)}
                style={{ width: "96%", marginLeft: "10px" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Payment Method"
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <TextField
              type="text"
              name="note"
              label="Note"
              fullWidth
              style={{ padding: 10 }}
              variant="outlined"
              onChange={(e) => setPayment({ ...payment, note: e.target.value })}
              value={payment.note}
            />
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleSubmitPayment}
              variant="contained"
              style={{ marginRight: "25px" }}
            >
              Save Record
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default Modal;
