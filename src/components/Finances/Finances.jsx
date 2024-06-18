import { useEffect, useState } from "react";
import "./Finances.css";

export default function Finances() {
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]); // [{amount: 100, date: "2021-09-01"}, {amount: 200, date: "2021-09-02"}

  const token = "7be4dd9b0da9f118093186c6f2c1c0bd68648a0f";

  useEffect(() => {
    fetch("https://mac.treibaer.de/api/v2/accounts/dashboard", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBalance(data.valueInCents / 100);
        setRecentTransactions(data.recentTransactions);
      });
  }, []);

  return (
    <div>
      <h2>Accounts</h2>
      <div>Total balance: {balance}€</div>
      <h2>Recent Transactions</h2>
      <div className="financeRowContainer">
        {recentTransactions.map((transaction, index) => (
          <div className="financeRow" key={index}>
            <div>{transaction.tag.icon}</div>
            <div>{transaction.title}</div>
            <div>{transaction.valueInCents / 100}€</div>
            <div>{transaction.purchasedAt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
