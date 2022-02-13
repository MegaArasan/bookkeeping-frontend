import React from "react";
import moment from "moment";
import { toCommas } from "../../initialState.js";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const PaymentHistory = ({ paymentRecords }) => {
  return (
    <div className="tabs">
      <div className="tab">
        <label className="tab-label" htmlFor="chck1">
          Payment History <span>{paymentRecords?.length}</span>
          <span className="space"></span>
        </label>
        <div className="tab-content">
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date Paid</TableCell>
                    <TableCell>Amount Paid</TableCell>
                    <TableCell>Payment Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentRecords?.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell>
                        {moment(record.datePaid).format("MMMM Do YYYY")}
                      </TableCell>
                      <TableCell>{toCommas(record.amountPaid)}</TableCell>
                      <TableCell>{record.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PaymentHistory };
