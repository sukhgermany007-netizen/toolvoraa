"use client";

import { useEffect, useMemo, useState } from "react";

type Transaction = {
  id: number;
  type: "income" | "expense";
  title: string;
  category: string;
  amount: number;
  date: string;
};

const expenseCategories = [
  "Rent",
  "Salary",
  "Electricity",
  "Marketing",
  "Transport",
  "Inventory",
  "Food",
  "Office",
  "Other",
];

const incomeCategories = [
  "Sales",
  "Services",
  "Online",
  "Cash",
  "Other",
];

export default function BusinessExpenseTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [type, setType] =
    useState<"income" | "expense">("expense");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Rent");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const saved = localStorage.getItem(
      "toolhub-business-expenses"
    );

    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch {
        setTransactions([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "toolhub-business-expenses",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((item) => item.type === "income")
        .reduce((sum, item) => sum + item.amount, 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((item) => item.type === "expense")
        .reduce((sum, item) => sum + item.amount, 0),
    [transactions]
  );

  const netProfit = totalIncome - totalExpense;

  const expenseByCategory = useMemo(() => {
    const result: Record<string, number> = {};

    transactions
      .filter((item) => item.type === "expense")
      .forEach((item) => {
        result[item.category] =
          (result[item.category] || 0) + item.amount;
      });

    return Object.entries(result).sort(
      (a, b) => b[1] - a[1]
    );
  }, [transactions]);

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const addTransaction = () => {
    const numericAmount = Number(amount);

    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      type,
      title: title.trim(),
      category,
      amount: numericAmount,
      date,
    };

    setTransactions((prev) => [
      newTransaction,
      ...prev,
    ]);

    setTitle("");
    setAmount("");
  };

  const deleteTransaction = (id: number) => {
    setTransactions((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const clearAll = () => {
    if (transactions.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete all transactions?"
    );

    if (confirmed) {
      setTransactions([]);
    }
  };

  const categories =
    type === "expense"
      ? expenseCategories
      : incomeCategories;

  return (
    <main className="page">
      <div className="container">

        {/* HEADER */}

        <header className="header">
          <div className="icon">💼</div>

          <h1>Business Expense Tracker</h1>

          <p>
            Track your business income, expenses and
            profit in one simple dashboard.
          </p>
        </header>

        {/* SUMMARY */}

        <section className="summary-grid">

          <div className="summary-card income">
            <div className="summary-icon">📈</div>

            <span>Total Income</span>

            <strong>
              {formatMoney(totalIncome)}
            </strong>
          </div>

          <div className="summary-card expense">
            <div className="summary-icon">📉</div>

            <span>Total Expenses</span>

            <strong>
              {formatMoney(totalExpense)}
            </strong>
          </div>

          <div
            className={`summary-card ${
              netProfit >= 0 ? "profit" : "loss"
            }`}
          >
            <div className="summary-icon">
              {netProfit >= 0 ? "💰" : "⚠️"}
            </div>

            <span>
              {netProfit >= 0
                ? "Net Profit"
                : "Net Loss"}
            </span>

            <strong>
              {formatMoney(Math.abs(netProfit))}
            </strong>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🧾</div>

            <span>Transactions</span>

            <strong>
              {transactions.length}
            </strong>
          </div>

        </section>

        {/* ADD TRANSACTION */}

        <section className="card">

          <h2>➕ Add Transaction</h2>

          <p className="description">
            Add your business income or expense.
          </p>

          <div className="type-buttons">

            <button
              className={
                type === "expense"
                  ? "type-button active-expense"
                  : "type-button"
              }
              onClick={() => {
                setType("expense");
                setCategory("Rent");
              }}
            >
              📉 Expense
            </button>

            <button
              className={
                type === "income"
                  ? "type-button active-income"
                  : "type-button"
              }
              onClick={() => {
                setType("income");
                setCategory("Sales");
              }}
            >
              📈 Income
            </button>

          </div>

          <div className="form-grid">

            <div>
              <label>Title</label>

              <input
                type="text"
                placeholder="e.g. Shop Rent"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />
            </div>

            <div>
              <label>Category</label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Amount (₹)</label>

              <input
                type="number"
                min="0"
                placeholder="0"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
              />
            </div>

            <div>
              <label>Date</label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
              />
            </div>

          </div>

          <button
            className="add-button"
            onClick={addTransaction}
          >
            + Add {type === "expense"
              ? "Expense"
              : "Income"}
          </button>

        </section>

        {/* EXPENSE BREAKDOWN */}

        {expenseByCategory.length > 0 && (
          <section className="card">

            <h2>📊 Expense Breakdown</h2>

            <p className="description">
              See where your business money is being
              spent.
            </p>

            <div className="breakdown">

              {expenseByCategory.map(
                ([categoryName, value]) => {
                  const percentage =
                    totalExpense > 0
                      ? (value / totalExpense) * 100
                      : 0;

                  return (
                    <div
                      className="breakdown-row"
                      key={categoryName}
                    >
                      <div className="breakdown-top">
                        <span>
                          {categoryName}
                        </span>

                        <strong>
                          {formatMoney(value)}
                        </strong>
                      </div>

                      <div className="progress">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <small>
                        {percentage.toFixed(1)}%
                      </small>
                    </div>
                  );
                }
              )}

            </div>

          </section>
        )}

        {/* TRANSACTIONS */}

        <section className="card">

          <div className="transactions-header">

            <div>
              <h2>📋 Transactions</h2>

              <p className="description">
                Your latest business transactions.
              </p>
            </div>

            {transactions.length > 0 && (
              <button
                className="clear-button"
                onClick={clearAll}
              >
                Clear All
              </button>
            )}

          </div>

          {transactions.length === 0 ? (
            <div className="empty">

              <div>🧾</div>

              <h3>
                No transactions yet
              </h3>

              <p>
                Add your first income or expense
                above.
              </p>

            </div>
          ) : (
            <div className="transaction-list">

              {transactions.map((item) => (
                <div
                  className="transaction"
                  key={item.id}
                >

                  <div className="transaction-icon">
                    {item.type === "income"
                      ? "📈"
                      : "📉"}
                  </div>

                  <div className="transaction-info">

                    <strong>
                      {item.title}
                    </strong>

                    <span>
                      {item.category} •{" "}
                      {item.date}
                    </span>

                  </div>

                  <div
                    className={
                      item.type === "income"
                        ? "transaction-amount income-text"
                        : "transaction-amount expense-text"
                    }
                  >
                    {item.type === "income"
                      ? "+"
                      : "-"}
                    {formatMoney(item.amount)}
                  </div>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteTransaction(item.id)
                    }
                    title="Delete"
                  >
                    🗑️
                  </button>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* HOW IT WORKS */}

        <section className="card">

          <h2>
            💡 How Business Expense Tracker Works
          </h2>

          <div className="tips">

            <div>
              <span>1</span>
              <p>
                Add your business income and
                expenses.
              </p>
            </div>

            <div>
              <span>2</span>
              <p>
                Organize transactions by
                category.
              </p>
            </div>

            <div>
              <span>3</span>
              <p>
                Track total income and
                expenses.
              </p>
            </div>

            <div>
              <span>4</span>
              <p>
                See your net profit or loss
                instantly.
              </p>
            </div>

          </div>

          <div className="privacy">
            🔒 Your data is stored locally in your
            browser using localStorage.
          </div>

        </section>

        <footer>
          ToolHub AI • Business Expense Tracker
        </footer>

      </div>

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .page {
          min-height: 100vh;
          padding: 40px 16px 70px;
          background:
            linear-gradient(
              180deg,
              #f8fafc,
              #eef4ff,
              #f8fafc
            );
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          color: #172033;
        }

        .container {
          max-width: 1150px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .icon {
          font-size: 45px;
          margin-bottom: 8px;
        }

        .header h1 {
          margin: 0;
          font-size: 42px;
          font-weight: 800;
        }

        .header p {
          color: #64748b;
          font-size: 17px;
          margin-top: 10px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }

        .summary-card {
          background: white;
          border-radius: 18px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          box-shadow:
            0 8px 25px rgba(15,23,42,0.05);
        }

        .summary-icon {
          font-size: 25px;
          margin-bottom: 10px;
        }

        .summary-card span {
          display: block;
          color: #64748b;
          font-size: 13px;
          margin-bottom: 7px;
        }

        .summary-card strong {
          display: block;
          font-size: 23px;
          color: #0f172a;
        }

        .summary-card.income {
          border-top: 4px solid #16a34a;
        }

        .summary-card.expense {
          border-top: 4px solid #dc2626;
        }

        .summary-card.profit {
          border-top: 4px solid #2563eb;
        }

        .summary-card.loss {
          border-top: 4px solid #dc2626;
        }

        .card {
          background: white;
          border-radius: 20px;
          padding: 26px;
          margin-bottom: 22px;
          border: 1px solid #e5e7eb;
          box-shadow:
            0 8px 25px rgba(15,23,42,0.05);
        }

        .card h2 {
          margin: 0;
          font-size: 21px;
        }

        .description {
          color: #64748b;
          font-size: 14px;
          margin-top: 7px;
        }

        .type-buttons {
          display: flex;
          gap: 10px;
          margin: 22px 0;
        }

        .type-button {
          padding: 11px 20px;
          border-radius: 10px;
          border: 1px solid #dbe3ef;
          background: #f8fafc;
          cursor: pointer;
          font-weight: 700;
        }

        .active-expense {
          background: #fee2e2;
          color: #b91c1c;
          border-color: #fecaca;
        }

        .active-income {
          background: #dcfce7;
          color: #15803d;
          border-color: #bbf7d0;
        }

        .form-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 16px;
        }

        label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        input,
        select {
          width: 100%;
          height: 50px;
          padding: 0 13px;
          border-radius: 10px;
          border: 1px solid #dbe3ef;
          background: white;
          font-size: 15px;
          outline: none;
        }

        input:focus,
        select:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 3px rgba(37,99,235,0.1);
        }

        .add-button {
          margin-top: 20px;
          width: 100%;
          height: 50px;
          border: none;
          border-radius: 10px;
          background: #2563eb;
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .add-button:hover {
          background: #1d4ed8;
        }

        .breakdown {
          margin-top: 22px;
        }

        .breakdown-row {
          margin-bottom: 18px;
        }

        .breakdown-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 7px;
          font-size: 14px;
        }

        .breakdown-top span {
          color: #475569;
        }

        .progress {
          width: 100%;
          height: 9px;
          background: #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #2563eb;
          border-radius: 20px;
        }

        .breakdown-row small {
          display: block;
          text-align: right;
          color: #64748b;
          margin-top: 4px;
        }

        .transactions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .clear-button {
          border: 1px solid #fecaca;
          background: #fff1f2;
          color: #dc2626;
          border-radius: 9px;
          padding: 9px 14px;
          cursor: pointer;
          font-weight: 700;
        }

        .transaction-list {
          margin-top: 20px;
        }

        .transaction {
          display: grid;
          grid-template-columns:
            45px 1fr auto 45px;
          align-items: center;
          gap: 12px;
          padding: 15px 0;
          border-bottom: 1px solid #eef2f7;
        }

        .transaction:last-child {
          border-bottom: none;
        }

        .transaction-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
        }

        .transaction-info strong {
          display: block;
          font-size: 15px;
        }

        .transaction-info span {
          display: block;
          margin-top: 4px;
          color: #64748b;
          font-size: 12px;
        }

        .transaction-amount {
          font-weight: 800;
          font-size: 15px;
        }

        .income-text {
          color: #16a34a;
        }

        .expense-text {
          color: #dc2626;
        }

        .delete-button {
          border: none;
          background: #f8fafc;
          border-radius: 8px;
          width: 38px;
          height: 38px;
          cursor: pointer;
        }

        .empty {
          text-align: center;
          padding: 45px 20px;
          color: #64748b;
        }

        .empty div {
          font-size: 40px;
        }

        .empty h3 {
          color: #334155;
          margin-bottom: 5px;
        }

        .tips {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 14px;
          margin-top: 20px;
        }

        .tips div {
          background: #f8fafc;
          padding: 18px;
          border-radius: 12px;
        }

        .tips span {
          display: inline-flex;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #2563eb;
          color: white;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .tips p {
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 0;
        }

        .privacy {
          margin-top: 20px;
          padding: 14px;
          border-radius: 10px;
          background: #eff6ff;
          color: #1d4ed8;
          text-align: center;
          font-size: 13px;
        }

        footer {
          text-align: center;
          color: #64748b;
          font-size: 13px;
          margin-top: 28px;
        }

        @media (max-width: 900px) {
          .summary-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .form-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .tips {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .page {
            padding: 25px 12px 50px;
          }

          .header h1 {
            font-size: 30px;
          }

          .header p {
            font-size: 15px;
          }

          .summary-grid,
          .form-grid,
          .tips {
            grid-template-columns: 1fr;
          }

          .card {
            padding: 20px;
          }

          .type-buttons {
            flex-direction: column;
          }

          .type-button {
            width: 100%;
          }

          .transactions-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .transaction {
            grid-template-columns:
              40px 1fr auto;
          }

          .delete-button {
            grid-column: 3;
            grid-row: 1;
          }

          .transaction-amount {
            grid-column: 2;
            grid-row: 2;
          }
        }

        @media print {
          button {
            display: none !important;
          }

          .page {
            background: white !important;
          }
        }

      `}</style>
    </main>
  );
}