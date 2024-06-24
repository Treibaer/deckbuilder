import { useEffect, useState } from "react";
import "./Finances.css";
import LoadingSpinner from "../Common/LoadingSpinner";
import Client from "../../Services/Client";

export default function Finances() {
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]); // [{amount: 100, date: "2021-09-01"}, {amount: 200, date: "2021-09-02"}

  let client = Client.shared;

  useEffect(() => {
    client.getFinancesDashboard().then((data) => {
      setIsLoading(false);
      setBalance(data.valueInCents / 100);
      setRecentTransactions(data.recentTransactions);
    });
  }, []);

  return (
    <div id="finances-view">
      <div id="finances-header">
        <h2>Finances</h2>
        <div>Total balance: {balance}€</div>
      </div>
      <h3>Recent Transactions</h3>
      <div className="financeRowContainer">
        {isLoading && <LoadingSpinner />}
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
