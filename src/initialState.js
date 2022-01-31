export const initialState = {
  items: [{ itemName: "", unitPrice: "", quantity: "", discount: "" }],
  total: 0,
  notes: "",
  rates: "",
  vat: 0,
  currency: "",
  invoiceNumber: Math.floor(Math.random() * 100000),
  status: "",
  type: "Invoice",
  creator: "",
};

export function toCommas(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}