"use client";

import { useState, useEffect } from "react";
import TransactionList from "@/components/TransactionList";
import ExpenseChart from "@/components/ExpenseChart";
import TransactionForm from "@/components/TransactionForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import CategoryPieChart from "@/components/CategoryChart";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // State to control modal

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);

  // Calculate total expenses
  const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(-5).reverse();

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 tracking-wide text-gray-800 dark:text-white">
        💰 Finance Tracker
      </h1>

      {/* Add Transaction Button & Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full max-w-xs hover:cursor-pointer bg-blue-600 hover:bg-blue-500 transition-all shadow-md md:py-3 md:text-lg"
            onClick={() => setIsOpen(true)} // Open modal on button click
          >
            + Add Transaction
          </Button>
        </DialogTrigger>
        <DialogContent className="border-gray-700 shadow-xl max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm setTransactions={setTransactions} setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>

      {/* Summary Cards Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Total Expenses */}
        <Card className="border  shadow-md">
          <CardContent className="md:mt-28 text-center">
            <h2 className="md:text-3xl font-semibold text-gray-700 dark:text-white">Total Expenses</h2>
            <p className="md:text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>

        {/* Expenses by Category */}
        <Card className="border  shadow-md">
          <CardContent className="m-auto">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-white">Category Breakdown</h2>
            <CategoryPieChart transactions={transactions} setTransactions={setTransactions} />
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border  shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Recent Transactions</h2>
            <ul className="space-y-2">
              {recentTransactions.map((t) => (
                <li key={t._id} className="flex justify-between text-sm border-b py-2">
                  <span className="text-gray-600 dark:text-gray-300">{t.description}</span>
                  <span className="font-bold text-red-500">${t.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Transaction List Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Expense Chart */}
        <Card className="border shadow-md">
          <CardContent className="p-4">
            <ExpenseChart transactions={transactions} />
          </CardContent>
        </Card>

        {/* Transaction List */}
        <Card className="border shadow-md">
          <CardContent className="p-4">
            <TransactionList transactions={transactions} setTransactions={setTransactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
