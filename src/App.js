import { useState } from "react";
import "./App.css";
import logo from "./logo.jpg";

const emptyItem = () => ({ desc: "", qty: 1, price: "" });

export default function App() {
  const [client, setClient] = useState({ name: "", email: "", phone: "" });
  const [invoiceNum, setInvoiceNum] = useState("001");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState([emptyItem()]);

  const updateItem = (i, field, val) =>
    setItems(items.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));

  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const [taxRate, setTaxRate] = useState(10);

  const subtotal = items.reduce((sum, { qty, price }) => sum + qty * (parseFloat(price) || 0), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const fmt = (n) => n.toFixed(2);

  return (
    <div className="page">
      <div className="invoice">
        {/* Header */}
        <div className="header no-print">
          <h1>Invoice Builder</h1>
          <button onClick={() => window.print()}>⬇ Export PDF</button>
        </div>

        <div className="invoice-header">
          <div className="from">
            <img src={logo} alt="logo" className="logo" />
            <h2>INVOICE</h2>
            <p className="from-address">2609 Collins Ave<br />Miami Beach, FL 33140<br />(305) 491-0131</p>
            <label>Invoice #</label>
            <input value={invoiceNum} onChange={(e) => setInvoiceNum(e.target.value)} />
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="to">
            <h3>Bill To</h3>
            {["name", "email", "phone"].map((f) => (
              <input
                key={f}
                placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                value={client[f]}
                onChange={(e) => setClient({ ...client, [f]: e.target.value })}
              />
            ))}
          </div>
        </div>

        {/* Line Items */}
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
              <th className="no-print"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>
                  <input
                    placeholder="Item description"
                    value={item.desc}
                    onChange={(e) => updateItem(i, "desc", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateItem(i, "qty", +e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={item.price}
                    onChange={(e) => updateItem(i, "price", e.target.value)}
                  />
                </td>
                <td>${fmt(item.qty * (parseFloat(item.price) || 0))}</td>
                <td className="no-print">
                  <button className="remove" onClick={() => removeItem(i)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="add-item no-print" onClick={() => setItems([...items, emptyItem()])}>
          + Add Item
        </button>

        {/* Totals */}
        <div className="totals">
          <div><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
          <div><span>Tax <input type="number" className="tax-input" value={taxRate} onChange={(e) => setTaxRate(+e.target.value)} />%</span><span>${fmt(tax)}</span></div>
          <div className="total-row"><span>Total</span><span>${fmt(total)}</span></div>
        </div>
      </div>
    </div>
  );
}
