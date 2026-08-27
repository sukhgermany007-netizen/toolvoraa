"use client";

import { useMemo, useState } from "react";

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState(2000);
  const [discount, setDiscount] = useState(20);

  const result = useMemo(() => {
    const price = Math.max(0, Number(originalPrice) || 0);
    const discountPercent = Math.min(
      100,
      Math.max(0, Number(discount) || 0)
    );

    const discountAmount = price * (discountPercent / 100);
    const finalPrice = price - discountAmount;

    return {
      price,
      discountPercent,
      discountAmount,
      finalPrice,
    };
  }, [originalPrice, discount]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const resetCalculator = () => {
    setOriginalPrice(2000);
    setDiscount(20);
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
        {/* Header */}
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
            🏷️
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              color: "#111827",
              fontWeight: 700,
            }}
          >
            Discount Calculator
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "10px",
              fontSize: "16px",
            }}
          >
            Calculate discount amount, final price and your savings.
          </p>
        </div>

        {/* Main Card */}
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
              gridTemplateColumns:
                "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "24px",
            }}
          >
            {/* LEFT */}
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
                Enter the original price and discount percentage.
              </p>

              {/* Original Price */}
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "8px",
                }}
              >
                Original Price
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
                  value={originalPrice}
                  onChange={(e) =>
                    setOriginalPrice(Number(e.target.value))
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
                Enter the original price before discount.
              </p>

              {/* Discount */}
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "8px",
                }}
              >
                Discount Percentage
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
                  max="100"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(Number(e.target.value))
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
                Enter a discount between 0% and 100%.
              </p>

              {/* Formula */}
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
                  Discount Formula
                </div>

                <strong
                  style={{
                    color: "#2563eb",
                    fontSize: "15px",
                  }}
                >
                  Final Price = Original Price − Discount
                </strong>
              </div>

              {/* Reset */}
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

            {/* RIGHT */}
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
                Discount Results
              </h2>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "20px",
                }}
              >
                Your final price and total savings.
              </p>

              {/* Final Price */}
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
                  Final Price
                </div>

                <div
                  style={{
                    fontSize: "34px",
                    fontWeight: 700,
                  }}
                >
                  {formatCurrency(result.finalPrice)}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    marginTop: "8px",
                    opacity: 0.9,
                  }}
                >
                  After {result.discountPercent}% discount
                </div>
              </div>

              {/* Result Boxes */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "18px",
                }}
              >
                {/* Original Price */}
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
                    Original Price
                  </div>

                  <strong
                    style={{
                      fontSize: "20px",
                      color: "#111827",
                    }}
                  >
                    {formatCurrency(result.price)}
                  </strong>
                </div>

                {/* Discount Amount */}
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
                    You Save
                  </div>

                  <strong
                    style={{
                      fontSize: "20px",
                      color: "#059669",
                    }}
                  >
                    {formatCurrency(result.discountAmount)}
                  </strong>
                </div>

                {/* Discount */}
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
                    Discount
                  </div>

                  <strong
                    style={{
                      fontSize: "20px",
                      color: "#7c3aed",
                    }}
                  >
                    {result.discountPercent}%
                  </strong>
                </div>

                {/* Final Price */}
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
                    Final Price
                  </div>

                  <strong
                    style={{
                      fontSize: "20px",
                      color: "#ea580c",
                    }}
                  >
                    {formatCurrency(result.finalPrice)}
                  </strong>
                </div>
              </div>

              {/* Summary */}
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
                  <span>Original Price</span>

                  <strong>
                    {formatCurrency(result.price)}
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
                  <span>Discount</span>

                  <strong>
                    {result.discountPercent}%
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
                  <span>Discount Amount</span>

                  <strong
                    style={{
                      color: "#059669",
                    }}
                  >
                    - {formatCurrency(result.discountAmount)}
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
                  <span>Final Price</span>

                  <strong
                    style={{
                      color: "#2563eb",
                    }}
                  >
                    {formatCurrency(result.finalPrice)}
                  </strong>
                </div>
              </div>

              {/* Success Message */}
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
                ✓ You save{" "}
                {formatCurrency(result.discountAmount)} on
                this purchase. Your final price is{" "}
                {formatCurrency(result.finalPrice)}.
              </div>
            </section>
          </div>
        </div>

        {/* Information */}
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
            How does Discount Calculator work?
          </h2>

          <p
            style={{
              color: "#64748b",
              lineHeight: 1.7,
              fontSize: "14px",
            }}
          >
            A discount reduces the original price of a product
            by a specific percentage.
          </p>

          <p
            style={{
              color: "#64748b",
              lineHeight: 1.7,
              fontSize: "14px",
            }}
          >
            For example, if a product costs ₹2,000 and has a
            20% discount, you save ₹400 and pay ₹1,600.
          </p>

          <div
            style={{
              background: "#f8fafc",
              borderRadius: "10px",
              padding: "15px",
              marginTop: "15px",
              color: "#334155",
              lineHeight: 1.8,
            }}
          >
            <strong>Example:</strong>
            <br />
            Original Price = ₹2,000
            <br />
            Discount = 20%
            <br />
            Discount Amount = ₹400
            <br />
            Final Price = ₹1,600
          </div>
        </div>
      </div>
    </main>
  );
}