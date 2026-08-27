"use client";

import { useMemo, useState } from "react";

type Item = {
  id: number;
  name: string;
  hsn: string;
  quantity: number;
  price: number;
};

const numberToWords = (num: number): string => {
  if (!num || num === 0) return "Zero Rupees Only";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const underThousand = (n: number): string => {
    let result = "";

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }

    if (n > 0) {
      result += ones[n] + " ";
    }

    return result.trim();
  };

  let result = "";

  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  if (crore) result += underThousand(crore) + " Crore ";
  if (lakh) result += underThousand(lakh) + " Lakh ";
  if (thousand) result += underThousand(thousand) + " Thousand ";
  if (num) result += underThousand(num);

  return result.trim() + " Rupees Only";
};

export default function QuotationGenerator() {
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gstin, setGstin] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerGstin, setCustomerGstin] = useState("");

  const [quotationNumber, setQuotationNumber] = useState("QT-0001");

  const [quotationDate, setQuotationDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [validUntil, setValidUntil] = useState("");

  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(18);

  const [notes, setNotes] = useState(
    "This quotation is valid subject to the terms and conditions mentioned above."
  );

  const [items, setItems] = useState<Item[]>([
    {
      id: 1,
      name: "",
      hsn: "",
      quantity: 1,
      price: 0,
    },
  ]);

  const updateItem = (
    id: number,
    field: keyof Item,
    value: string | number
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
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

    setItems((current) => current.filter((item) => item.id !== id));
  };

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  }, [items]);

  const discountAmount = (subtotal * Number(discount || 0)) / 100;

  const taxableAmount = Math.max(subtotal - discountAmount, 0);

  const gstAmount = (taxableAmount * Number(gst || 0)) / 100;

  const grandTotal = taxableAmount + gstAmount;

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10 no-print">
          <div className="inline-block rounded-full border border-blue-500/50 bg-blue-500/10 px-5 py-2 text-blue-300 mb-4">
            📄 Professional Business Tool
          </div>

          <h1 className="text-4xl md:text-5xl font-bold">
            Quotation Generator
          </h1>

          <p className="text-slate-400 mt-3">
            Create professional quotations quickly and easily.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* LEFT SIDE */}
          <div className="space-y-6 no-print">
            {/* BUSINESS DETAILS */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-5">
                🏢 Business Details
              </h2>

              <div className="space-y-4">
                <input
                  className="input"
                  placeholder="Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />

                <textarea
                  className="input min-h-24"
                  placeholder="Business Address"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="input"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <input
                    className="input"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <input
                  className="input"
                  placeholder="GSTIN (Optional)"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                />
              </div>
            </section>

            {/* CUSTOMER */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-5">
                👤 Customer Details
              </h2>

              <div className="space-y-4">
                <input
                  className="input"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />

                <textarea
                  className="input min-h-24"
                  placeholder="Customer Address"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="input"
                    placeholder="Customer Phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />

                  <input
                    className="input"
                    placeholder="Customer GSTIN"
                    value={customerGstin}
                    onChange={(e) => setCustomerGstin(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* QUOTATION DETAILS */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-5">
                📋 Quotation Details
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Quotation Number</label>
                  <input
                    className="input"
                    value={quotationNumber}
                    onChange={(e) => setQuotationNumber(e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Quotation Date</label>
                  <input
                    type="date"
                    className="input"
                    value={quotationDate}
                    onChange={(e) => setQuotationDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Valid Until</label>
                  <input
                    type="date"
                    className="input"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* ITEMS */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold">
                  🛒 Products / Services
                </h2>

                <button
                  onClick={addItem}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
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
                        className="input"
                        placeholder="Product / Service"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(item.id, "name", e.target.value)
                        }
                      />

                      <input
                        className="input"
                        placeholder="HSN / SAC"
                        value={item.hsn}
                        onChange={(e) =>
                          updateItem(item.id, "hsn", e.target.value)
                        }
                      />

                      <input
                        type="number"
                        min="1"
                        className="input"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                      />

                      <input
                        type="number"
                        min="0"
                        className="input"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "price",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>

                    <div className="text-right text-blue-400 mt-3 font-semibold">
                      Total: {formatCurrency(item.quantity * item.price)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* TAX */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-5">
                💰 Tax & Discount
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    className="input"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(Number(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="label">GST (%)</label>
                  <select
                    className="input"
                    value={gst}
                    onChange={(e) => setGst(Number(e.target.value))}
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
              </div>
            </section>

            {/* NOTES */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-5">
                📝 Notes / Terms
              </h2>

              <textarea
                className="input min-h-32"
                placeholder="Notes / Terms & Conditions"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </section>
          </div>

          {/* RIGHT SIDE - QUOTATION */}
          <div className="lg:sticky lg:top-6">
            <section className="quotation-print bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* QUOTATION HEADER */}
              <div className="bg-blue-600 text-white p-7">
                <div className="flex justify-between gap-5">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {businessName || "Your Business Name"}
                    </h2>

                    <p className="mt-2 whitespace-pre-line text-blue-100">
                      {businessAddress || "Business Address"}
                    </p>

                    <p className="text-blue-100">
                      {phone || "Phone Number"}
                    </p>

                    <p className="text-blue-100">
                      {email || "Email Address"}
                    </p>

                    {gstin && (
                      <p className="text-blue-100">
                        GSTIN: {gstin}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <h1 className="text-3xl font-bold">
                      QUOTATION
                    </h1>

                    <p className="mt-3">
                      #{quotationNumber}
                    </p>

                    <p>
                      {quotationDate || "Date"}
                    </p>

                    {validUntil && (
                      <p>
                        Valid Until: {validUntil}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* CUSTOMER */}
              <div className="p-7 border-b">
                <p className="text-xs font-bold text-slate-500">
                  QUOTATION FOR
                </p>

                <h3 className="text-xl font-bold mt-1">
                  {customerName || "Customer Name"}
                </h3>

                <p className="whitespace-pre-line">
                  {customerAddress || "Customer Address"}
                </p>

                <p>
                  {customerPhone || "Customer Phone"}
                </p>

                {customerGstin && (
                  <p>
                    GSTIN: {customerGstin}
                  </p>
                )}
              </div>

              {/* ITEMS TABLE */}
              <div className="p-7">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2">
                      <th className="text-left py-3">Item</th>
                      <th className="text-left py-3">HSN</th>
                      <th className="text-center py-3">Qty</th>
                      <th className="text-right py-3">Price</th>
                      <th className="text-right py-3">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b"
                      >
                        <td className="py-3">
                          {item.name || "Product / Service"}
                        </td>

                        <td className="py-3">
                          {item.hsn || "-"}
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

                {/* TOTALS */}
                <div className="mt-7 ml-auto max-w-sm space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
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
                    <span>Taxable Amount</span>
                    <span>
                      {formatCurrency(taxableAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST ({gst}%)</span>
                    <span>
                      {formatCurrency(gstAmount)}
                    </span>
                  </div>

                  <div className="border-t-2 pt-4 flex justify-between text-xl font-bold">
                    <span>Grand Total</span>
                    <span className="text-blue-600">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* WORDS */}
                <div className="border-t mt-7 pt-5">
                  <p className="text-xs font-bold text-slate-500">
                    AMOUNT IN WORDS
                  </p>

                  <p className="font-semibold mt-1">
                    {numberToWords(Math.round(grandTotal))}
                  </p>
                </div>

                {/* NOTES */}
                <div className="border-t mt-7 pt-5">
                  <p className="text-xs font-bold text-slate-500">
                    NOTES / TERMS & CONDITIONS
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm">
                    {notes || "No additional terms."}
                  </p>
                </div>

                {/* SIGNATURE */}
                <div className="mt-14 flex justify-end">
                  <div className="text-center w-48">
                    <div className="border-t pt-2 text-sm">
                      Authorized Signature
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 p-5 text-center text-xs text-slate-500">
                This is a computer generated quotation.
              </div>
            </section>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-5 no-print">
              <button
                onClick={handlePrint}
                className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-semibold"
              >
                🖨️ Print / Save PDF
              </button>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
              >
                ↑ Back to Top
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-10 no-print">
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to ToolHub AI
          </a>
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          background: #1e293b;
          border: 1px solid #334155;
          color: white;
          border-radius: 10px;
          padding: 12px 14px;
          outline: none;
        }

        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        }

        .label {
          display: block;
          color: #94a3b8;
          font-size: 14px;
          margin-bottom: 8px;
        }

        @media print {
          @page {
            size: A4;
            margin: 8mm;
          }

          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .quotation-print {
            display: block !important;
            width: 100% !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }

          main {
            background: white !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}