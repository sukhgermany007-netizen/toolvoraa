"use client";

import { useMemo, useState } from "react";

export default function MarkupCalculator() {
  const [costPrice, setCostPrice] = useState(1000);
  const [markup, setMarkup] = useState(30);

  const result = useMemo(() => {
    const cost = Math.max(0, Number(costPrice) || 0);
    const markupPercent = Math.max(0, Number(markup) || 0);

    const profit = cost * (markupPercent / 100);
    const sellingPrice = cost + profit;

    const profitMargin =
      sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

    return {
      cost,
      markupPercent,
      profit,
      sellingPrice,
      profitMargin,
    };
  }, [costPrice, markup]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const resetCalculator = () => {
    setCostPrice(1000);
    setMarkup(30);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "42px",
              marginBottom: "8px",
            }}
          >
            📈
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              color: "#111827",
              fontWeight: 700,
            }}
          >
            Markup Calculator
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "10px",
              fontSize: "16px",
            }}
          >
            Calculate selling price and profit using markup percentage.
          </p>
        </div>

        {/* MAIN CARD */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "24px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "24px",
            }}
          >
            {/* LEFT SIDE */}
            <section
              style={{
                padding: "10px",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  fontSize: "22px",
                  color: "#111827",
                }}
              >
                Product Information
              </h2>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "25px",
                }}
              >
                Enter your product cost and desired markup.
              </p>

              {/* COST PRICE */}
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "8px",
                }}
              >
                Cost Price
              </label>

              <div
                style={{
                  position: "relative",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={costPrice}
                  onChange={(e) =>
                    setCostPrice(Number(e.target.value))
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "14px 14px 14px 34px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "9px",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  marginTop: 0,
                  marginBottom: "25px",
                }}
              >
                Your product purchase or production cost.
              </p>

              {/* MARKUP */}
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "8px",
                }}
              >
                Markup Percentage
              </label>

              <div
                style={{
                  position: "relative",
                  marginBottom: "8px",
                }}
              >
                <input
                  type="number"
                  min="0"
                  value={markup}
                  onChange={(e) =>
                    setMarkup(Number(e.target.value))
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "14px 45px 14px 14px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "9px",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />

                <span
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  %
                </span>
              </div>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  marginTop: 0,
                  marginBottom: "25px",
                }}
              >
                Percentage added to your product cost.
              </p>

              {/* FORMULA */}
              <div
                style={{
                  background: "#eff6ff",
                  borderRadius: "10px",
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    color: "#334155",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  Selling Price Formula
                </div>

                <strong
                  style={{
                    color: "#2563eb",
                    fontSize: "15px",
                  }}
                >
                  Cost Price + Markup = Selling Price
                </strong>
              </div>

              {/* RESET */}
              <button
                onClick={resetCalculator}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  borderRadius: "9px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                ↻ Reset Calculator
              </button>
            </section>

            {/* RIGHT SIDE */}
            <section
              style={{
                padding: "10px",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  fontSize: "22px",
                  color: "#111827",
                }}
              >
                Markup Results
              </h2>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "20px",
                }}
              >
                Your estimated selling price and profit.
              </p>

              {/* SELLING PRICE */}
              <div
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  borderRadius: "14px",
                  padding: "26px",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    opacity: 0.9,
                    marginBottom: "8px",
                  }}
                >
                  Recommended Selling Price
                </div>

                <div
                  style={{
                    fontSize: "34px",
                    fontWeight: 700,
                  }}
                >
                  {formatCurrency(result.sellingPrice)}
                </div>
              </div>

              {/* RESULT BOXES */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "18px",
                }}
              >
                {/* COST */}
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "18px",
                  }}
                >
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      marginBottom: "7px",
                    }}
                  >
                    Cost Price
                  </div>

                  <strong
                    style={{
                      fontSize: "20px",
                      color: "#111827",
                    }}
                  >
                    {formatCurrency(result.cost)}
                  </strong>
                </div>

                {/* PROFIT */}
                <div
                  style={{
                    background: "#ecfdf5",
                    borderRadius: "12px",
                    padding: "18px",
                  }}
                >
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      marginBottom: "7px",
                    }}
                  >
                    Profit
                  </div>

                  <strong
                    style={{
                      fontSize: "20px",
                      color: "#059669",
                    }}
                  >
                    {formatCurrency(result.profit)}
                  </strong>
                </div>

                {/* MARKUP */}
                <div
                  style={{
                    background: "#f5f3ff",
                    borderRadius: "12px",
                    padding: "18px",
                  }}
                >
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      marginBottom: "7px",
                    }}
                  >
                    Markup
                  </div>

                  <strong
                    style={{
                      fontSize: "20px",
                      color: "#7c3aed",
                    }}
                  >
                    {result.markupPercent}%
                  </strong>
                </div>

                {/* PROFIT MARGIN */}
                <div
                  style={{
                    background: "#fff7ed",
                    borderRadius: "12px",
                    padding: "18px",
                  }}
                >
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      marginBottom: "7px",
                    }}
                  >
                    Profit Margin
                  </div>

                  <strong
                    style={{
                      fontSize: "20px",
                      color: "#ea580c",
                    }}
                  >
                    {result.profitMargin.toFixed(1)}%
                  </strong>
                </div>
              </div>

              {/* SUMMARY */}
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "18px",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "15px",
                    color: "#111827",
                  }}
                >
                  Calculation Summary
                </h3>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "11px 0",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <span>Cost Price</span>

                  <strong>
                    {formatCurrency(result.cost)}
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "11px 0",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <span>Markup</span>

                  <strong>
                    {result.markupPercent}%
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "11px 0",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <span>Profit</span>

                  <strong
                    style={{
                      color: "#059669",
                    }}
                  >
                    {formatCurrency(result.profit)}
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "11px 0",
                    fontWeight: 700,
                  }}
                >
                  <span>Selling Price</span>

                  <strong
                    style={{
                      color: "#2563eb",
                    }}
                  >
                    {formatCurrency(result.sellingPrice)}
                  </strong>
                </div>
              </div>

              {/* SUCCESS MESSAGE */}
              <div
                style={{
                  marginTop: "16px",
                  background: "#ecfdf5",
                  color: "#047857",
                  borderRadius: "10px",
                  padding: "15px",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                ✓ A {result.markupPercent}% markup on{" "}
                {formatCurrency(result.cost)} gives you a
                selling price of{" "}
                {formatCurrency(result.sellingPrice)}.
              </div>
            </section>
          </div>
        </div>

        {/* INFORMATION SECTION */}
        <div
          style={{
            marginTop: "20px",
            background: "#ffffff",
            borderRadius: "14px",
            padding: "22px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.04)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#111827",
              fontSize: "20px",
            }}
          >
            How does Markup Calculator work?
          </h2>

          <p
            style={{
              color: "#64748b",
              lineHeight: 1.7,
              fontSize: "14px",
            }}
          >
            Markup is the percentage added to the cost of a
            product to determine its selling price.
          </p>

          <p
            style={{
              color: "#64748b",
              lineHeight: 1.7,
              fontSize: "14px",
            }}
          >
            For example, if a product costs ₹1,000 and you add
            a 30% markup, the profit is ₹300 and the selling
            price becomes ₹1,300.
          </p>

          <div
            style={{
              background: "#f8fafc",
              borderRadius: "10px",
              padding: "15px",
              marginTop: "15px",
              color: "#334155",
            }}
          >
            <strong>Example:</strong>
            <br />
            Cost Price = ₹1,000
            <br />
            Markup = 30%
            <br />
            Profit = ₹300
            <br />
            Selling Price = ₹1,300
          </div>
        </div>
      </div>
    </main>
  );
}