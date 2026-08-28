"use client";

import { useState } from "react";

type Item = {
  id: number;
  name: string;
  hsn: string;
  quantity: number;
  price: number;
};

export default function InvoiceGenerator() {
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gstin, setGstin] = useState("");
  const [logo, setLogo] = useState("");
  const [signature, setSignature] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
const [customerGstin, setCustomerGstin] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-0001");

const [invoiceDate, setInvoiceDate] = useState(
  new Date().toISOString().split("T")[0]
);

const [dueDate, setDueDate] = useState("");
const [amountPaid, setAmountPaid] = useState(0);

const [discount, setDiscount] = useState(0);
const [gst, setGst] = useState(18);
const [gstType, setGstType] = useState("CGST + SGST");

const [paymentStatus, setPaymentStatus] = useState("UNPAID");
const [paymentMethod, setPaymentMethod] = useState("UPI");

const [upiId, setUpiId] = useState("");
const [bankName, setBankName] = useState("");
const [accountNumber, setAccountNumber] = useState("");
const [ifsc, setIfsc] = useState("");
const [notes, setNotes] = useState("");
const [items, setItems] = useState<Item[]>([
  {
    id: 1,
    name: "",
    hsn: "",
    quantity: 1,
    price: 0,
  },
]);


 

    

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        name: "",
        hsn: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length === 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: number,
    field: keyof Item,
    value: string | number
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setSignature(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setLogo(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const subtotal = items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = (taxableAmount * gst) / 100;
  const grandTotal = taxableAmount + gstAmount;
  const balanceDue = Math.max(grandTotal - amountPaid, 0);

  const cgstAmount =
    gstType === "CGST + SGST" ? gstAmount / 2 : 0;

  const sgstAmount =
    gstType === "CGST + SGST" ? gstAmount / 2 : 0;

  const igstAmount =
    gstType === "IGST" ? gstAmount : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const numberToWords = (num: number) => {
    const ones = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
      "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
      "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen",
      "Nineteen"
    ];
    const tens = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty",
      "Seventy", "Eighty", "Ninety"
    ];

    const underThousand = (n: number): string => {
      let result = "";
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + " Hundred";
        n %= 100;
        if (n) result += " ";
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)];
        n %= 10;
        if (n) result += " " + ones[n];
      } else if (n > 0) {
        result += ones[n];
      }
      return result;
    };

    const whole = Math.floor(num);
    const paise = Math.round((num - whole) * 100);

    if (whole === 0 && paise === 0) return "Zero Rupees Only";

    let result = "";
    let n = whole;

    if (n >= 10000000) {
      result += underThousand(Math.floor(n / 10000000)) + " Crore ";
      n %= 10000000;
    }
    if (n >= 100000) {
      result += underThousand(Math.floor(n / 100000)) + " Lakh ";
      n %= 100000;
    }
    if (n >= 1000) {
      result += underThousand(Math.floor(n / 1000)) + " Thousand ";
      n %= 1000;
    }
    if (n > 0) result += underThousand(n);

    result = result.trim() + " Rupees";
    if (paise > 0) result += " and " + underThousand(paise) + " Paise";
    return result + " Only";
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-block rounded-full border border-blue-500/50 bg-blue-500/10 px-5 py-2 text-blue-400 mb-4">
            🧾 Professional GST Invoice Tool
          </div>

          <h1 className="text-4xl md:text-5xl font-bold">
            Invoice Generator
          </h1>

          <p className="text-slate-400 mt-3">
            Create professional GST invoices quickly and easily.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* BUSINESS DETAILS */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-5">
                🏢 Business Details
              </h2>

              <div className="space-y-4">

                <input
                  type="text"
                  placeholder="Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="input"
                />

                <textarea
                  placeholder="Business Address"
                  value={businessAddress}
                  onChange={(e) =>
                    setBusinessAddress(e.target.value)
                  }
                  className="input min-h-24"
                />

                <div className="grid md:grid-cols-2 gap-4">

                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                  />

                </div>

                <input
                  type="text"
                  placeholder="GSTIN"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="input"
                />

                {/* LOGO */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Business Logo
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogo}
                    className="block w-full text-sm text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-500"
                  />
                </div>

                {logo && (
                  <div className="bg-slate-800 rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-2">
                      Logo Preview
                    </p>

                    <img
                      src={logo}
                      alt="Business Logo"
                      className="h-20 object-contain"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Authorized Signature
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignature}
                    className="block w-full text-sm text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-500"
                  />
                </div>

                {signature && (
                  <div className="bg-slate-800 rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-2">
                      Signature Preview
                    </p>

                    <img
                      src={signature}
                      alt="Authorized Signature"
                      className="h-16 max-w-48 object-contain bg-white rounded-lg p-2"
                    />
                  </div>
                )}

              </div>
            </section>

            {/* CUSTOMER DETAILS */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-5">
                👤 Customer Details
              </h2>

              <div className="space-y-4">

                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                  className="input"
                />

                <textarea
                  placeholder="Customer Address"
                  value={customerAddress}
                  onChange={(e) =>
                    setCustomerAddress(e.target.value)
                  }
                  className="input min-h-24"
                />

                <input
                  type="text"
                  placeholder="Customer Phone"
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(e.target.value)
                  }
                  className="input"
                />
<input
  type="text"
  placeholder="Customer GSTIN"
  value={customerGstin}
  onChange={(e) =>
    setCustomerGstin(e.target.value.toUpperCase())
  }
  className="input"
/>
              </div>
            </section>

            {/* INVOICE DETAILS */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-5">
                📄 Invoice Details
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                <div>
                  <label className="block mb-2 text-sm text-slate-400">
                    Invoice Number
                  </label>

                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) =>
                      setInvoiceNumber(e.target.value)
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-400">
                    Invoice Date
                  </label>

                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) =>
                      setInvoiceDate(e.target.value)
                    }
                    className="input"
                  />
                </div>

              </div>
            </section>

            {/* PRODUCTS */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <div className="flex justify-between items-center mb-5">

                <h2 className="text-2xl font-bold">
                  🛒 Products / Items
                </h2>

                <button
                  onClick={addItem}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold"
                >
                  + Add Item
                </button>

              </div>

              <div className="space-y-4">

                {items.map((item, index) => (

                  <div
                    key={item.id}
                    className="border border-slate-700 rounded-xl p-4"
                  >

                    <div className="flex justify-between mb-3">

                      <span className="font-semibold">
                        Item {index + 1}
                      </span>

                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}

                    </div>

                    <div className="grid md:grid-cols-4 gap-3">

                      <input
                        type="text"
                        placeholder="Product Name"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "name",
                            e.target.value
                          )
                        }
                        className="input"
                      />
<input
  type="text"
  placeholder="HSN Code"
  value={item.hsn}
  onChange={(e) =>
    updateItem(
      item.id,
      "hsn",
      e.target.value
    )
  }
  className="input"
/>
                      <input
                        type="number"
                        min="1"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                        className="input"
                      />

                      <input
                        type="number"
                        min="0"
                        placeholder="Price"
                        value={item.price || ""}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "price",
                            Number(e.target.value)
                          )
                        }
                        className="input"
                      />

                    </div>

                    <div className="text-right mt-3 text-blue-400 font-semibold">
                      Total:{" "}
                      {formatCurrency(
                        item.quantity * item.price
                      )}
                    </div>

                  </div>

                ))}

              </div>

            </section>

            {/* GST & DISCOUNT */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h2 className="text-2xl font-bold mb-5">
                💰 Tax & Discount
              </h2>

              <div className="grid md:grid-cols-3 gap-4">

                <div>
                  <label className="block mb-2 text-sm text-slate-400">
                    Discount (%)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={discount === 0 ? "" : discount}
onChange={(e) =>
  setDiscount(e.target.value === "" ? 0 : Number(e.target.value))
}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-400">
                    GST (%)
                  </label>

                  <select
                    value={gst}
                    onChange={(e) =>
                      setGst(Number(e.target.value))
                    }
                    className="input"
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-400">
                    GST Type
                  </label>

                  <select
                    value={gstType}
                    onChange={(e) =>
                      setGstType(e.target.value)
                    }
                    className="input"
                  >
                    <option value="CGST + SGST">
                      CGST + SGST
                    </option>

                    <option value="IGST">
                      IGST
                    </option>
                  </select>
                </div>

              </div>

            </section>

            {/* PAYMENT DETAILS */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-5">
                💳 Payment & Notes
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm text-slate-400">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="input"
                  >
                    <option value="UNPAID">UNPAID</option>
                    <option value="PAID">PAID</option>
                    <option value="PARTIALLY PAID">PARTIALLY PAID</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-400">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}

                    className="input"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {paymentMethod === "UPI" && (
  <input
    type="text"
    placeholder="UPI ID"
    value={upiId}
    onChange={(e) => setUpiId(e.target.value)}
    className="input"
  />
)}

{paymentMethod === "Bank Transfer" && (
  <>
    <input
      type="text"
      placeholder="Bank Name"
      value={bankName}
      onChange={(e) => setBankName(e.target.value)}
      className="input"
    />

    <input
      type="text"
      placeholder="Account Number"
      value={accountNumber}
      onChange={(e) => setAccountNumber(e.target.value)}
      className="input"
    />

    <input
      type="text"
      placeholder="IFSC Code"
      value={ifsc}
      onChange={(e) => setIfsc(e.target.value)}
      className="input"
    />
  </>
)}

                <textarea
                  placeholder="Notes / Terms & Conditions"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input md:col-span-2 min-h-20"
                />
              </div>
            </section>

          </div>

          {/* RIGHT SIDE - INVOICE */}
          <div className="lg:sticky lg:top-6 h-fit">

            <section className="invoice-print bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden">

              {/* INVOICE HEADER */}
              <div className="bg-blue-600 text-white p-6">

                <div className="flex justify-between gap-5">

                  <div>

                    {logo && (
                      <img
                        src={logo}
                        alt="Logo"
                        className="h-16 w-24 object-contain bg-white rounded-lg mb-3"
                      />
                    )}

                    <h2 className="text-2xl font-bold">
                      {businessName || "Your Business Name"}
                    </h2>

                    <p className="text-blue-100 mt-2 whitespace-pre-line">
                      {businessAddress || "Business Address"}
                    </p>

                    <p className="text-blue-100">
                      {phone || "Phone Number"}
                    </p>

                    <p className="text-blue-100">
                      {email || "Email Address"}
                    </p>

                    {gstin && (
                      <p className="text-blue-100 mt-1">
                        GSTIN: {gstin}
                      </p>
                    )}

                  </div>

                  <div className="text-right">

                    <h1 className="text-3xl font-bold">
                      INVOICE
                    </h1>

                    <p className="mt-3">
                      #{invoiceNumber}
                    </p>

                    <p>
                      {invoiceDate}
                    </p>

                  </div>

                </div>

              </div>

              {/* CUSTOMER */}
              <div className="p-6 border-b border-slate-200">

                <p className="text-sm text-slate-500 font-semibold uppercase">
                  Bill To
                </p>

                <h3 className="text-xl font-bold mt-1">
                  {customerName || "Customer Name"}
                </h3>

                <p className="text-slate-600 whitespace-pre-line">
                  {customerAddress || "Customer Address"}
                </p>

                <p className="text-slate-600">
                  {customerPhone || "Customer Phone"}
                </p>
<p className="text-slate-600">
  {customerGstin || "Customer GSTIN"}
</p>
              </div>

              {/* ITEMS TABLE */}
              <div className="p-6">

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead>

                      <tr className="border-b-2 border-slate-200">
  <th className="text-left py-3">
    Item
  </th>

  <th className="text-center py-3">
    HSN
  </th>

  <th className="text-center py-3">
    Qty
  </th>

  <th className="text-right py-3">
    Price
  </th>

  <th className="text-right py-3">
    Total
  </th>
 </tr>

                    </thead>

                    <tbody>

                      {items.map((item) => (

                        <tr
                          key={item.id}
                          className="border-b border-slate-100"
                        >

                          <td className="py-3">
                            {item.name || "Product"}
                          </td>
<td className="text-center py-3">
  {item.hsn || ""}
</td>
                          <td className="text-center py-3">
                            {item.quantity}
                          </td>

                          <td className="text-right py-3">
                            {formatCurrency(item.price)}
                          </td>

                          <td className="text-right py-3 font-semibold">
                            {formatCurrency(
                              item.quantity * item.price
                            )}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

                {/* TOTALS */}
                <div className="mt-6 ml-auto max-w-sm space-y-3">

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Discount ({discount}%)
                    </span>

                    <span>
                      - {formatCurrency(discountAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Taxable Amount
                    </span>

                    <span>
                      {formatCurrency(taxableAmount)}
                    </span>
                  </div>

                  {gstType === "CGST + SGST" ? (
                    <>
                      <div className="flex justify-between">
                        <span>
                          CGST ({gst / 2}%)
                        </span>

                        <span>
                          {formatCurrency(cgstAmount)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>
                          SGST ({gst / 2}%)
                        </span>

                        <span>
                          {formatCurrency(sgstAmount)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span>
                        IGST ({gst}%)
                      </span>

                      <span>
                        {formatCurrency(igstAmount)}
                      </span>
                    </div>
                  )}

                  <div className="border-t-2 border-slate-300 pt-3 flex justify-between text-xl font-bold">

                    <span>
                      Grand Total
                    </span>

                    <span className="text-blue-600">
                      {formatCurrency(grandTotal)}
                    </span>

                  </div>

                </div>

                {/* PAYMENT + AMOUNT IN WORDS */}
                <div className="mt-6 border-t border-slate-200 pt-4 grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Amount in Words</p>
                    <p className="text-slate-600 mt-1">
                      {numberToWords(grandTotal)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">Payment Status</p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${
                        paymentStatus === "PAID"
                          ? "bg-green-100 text-green-700"
                          : paymentStatus === "PARTIALLY PAID"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {paymentStatus}
                    </span>
                    <p className="text-slate-600 mt-2">
                      Method: {paymentMethod}
                    </p>
                  </div>
                </div>
{(
  (paymentMethod === "UPI" && upiId) ||
  (paymentMethod === "Bank Transfer" && (bankName || accountNumber || ifsc)) ||
  notes
) && (
                  <div className="mt-4 border-t border-slate-200 pt-4 text-sm">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold mb-1">Payment Details</p>

                        {paymentMethod === "UPI" && upiId && (
                          <p>UPI: {upiId}</p>
                        )}

                        {paymentMethod === "Bank Transfer" && (
                          <>
                            {bankName && <p>Bank: {bankName}</p>}
                            {accountNumber && <p>Account No.: {accountNumber}</p>}
                            {ifsc && <p>IFSC: {ifsc}</p>}
                          </>
                        )}

                        {notes && (
                          <p className="mt-2 whitespace-pre-line text-slate-600">
                            {notes}
                          </p>
                        )}
                      </div>

                      {upiId && (
                        <div className="text-center">
                          <p className="font-semibold mb-2">Scan to Pay</p>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                              `upi://pay?pa=${upiId}&pn=${businessName || "Business"}&am=${grandTotal.toFixed(2)}&cu=INR`
                            )}`}
                            alt="UPI QR Code"
                            className="w-28 h-28 mx-auto border border-slate-200 rounded-lg"
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            UPI: {upiId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                  <div className="text-center min-w-40">
                    {signature ? (
                      <img
                        src={signature}
                        alt="Authorized Signature"
                        className="h-14 max-w-40 mx-auto object-contain"
                      />
                    ) : (
                      <div className="h-14" />
                    )}
                    <div className="border-t border-slate-400 pt-1 text-xs text-slate-600">
                      Authorized Signature
                    </div>
                  </div>
                </div>

              </div>

              {/* FOOTER */}
              <div className="bg-slate-50 p-6 text-center border-t border-slate-200">

                <p className="font-semibold">
                  Thank you for your business!
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  This is a computer generated invoice.
                </p>

              </div>

            </section>

            {/* BUTTONS */}
            <div className="no-print grid grid-cols-2 gap-4 mt-5">

              <button
                onClick={() => window.print()}
                className="bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-semibold"
              >
                🖨️ Print Invoice
              </button>

              <button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold"
              >
                📄 Download PDF
              </button>

            </div>

          </div>

        </div>

        {/* BACK */}
        <div className="no-print text-center mt-10">
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to ToolVoraa
          </a>
        </div>

      </div>

      {/* INPUT STYLE */}
      <style>{`
        .input {
          width: 100%;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 10px;
          padding: 12px 14px;
          color: white;
          outline: none;
        }

        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        }

        .input::placeholder {
          color: #94a3b8;
        }

        @page {
          size: A4 portrait;
          margin: 0;
        }

        @media print {
          html, body {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: white !important;
          }

          main {
            min-height: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: white !important;
          }

          body * {
            visibility: hidden !important;
          }

          .invoice-print,
          .invoice-print * {
            visibility: visible !important;
          }

          .invoice-print {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 6mm !important;
            box-sizing: border-box !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
            background: white !important;
            color: #0f172a !important;
            font-size: 9px !important;
            line-height: 1.15 !important;
            page-break-after: avoid !important;
          }

          .invoice-print .p-6 { padding: 9px !important; }
          .invoice-print .p-4 { padding: 6px !important; }
          .invoice-print .py-3 {
            padding-top: 3px !important;
            padding-bottom: 3px !important;
          }
          .invoice-print .mt-6 { margin-top: 6px !important; }
          .invoice-print .mt-4 { margin-top: 4px !important; }
          .invoice-print .mt-3 { margin-top: 3px !important; }
          .invoice-print .mt-2 { margin-top: 2px !important; }
          .invoice-print .pt-4 { padding-top: 4px !important; }
          .invoice-print .gap-4,
          .invoice-print .gap-5 { gap: 5px !important; }

          .invoice-print .text-3xl { font-size: 19px !important; }
          .invoice-print .text-2xl { font-size: 15px !important; }
          .invoice-print .text-xl { font-size: 13px !important; }
          .invoice-print .text-sm { font-size: 8px !important; }

          .invoice-print table {
            width: 100% !important;
            border-collapse: collapse !important;
          }

          .invoice-print tr,
          .invoice-print td,
          .invoice-print th {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .invoice-print img {
            max-height: 45px !important;
            object-fit: contain !important;
          }

          .invoice-print .bg-blue-600 {
            background: #2563eb !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .invoice-print .bg-slate-50 {
            background: #f8fafc !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print { display: none !important; }
        }
        `}</style>

    </main>
  );
}