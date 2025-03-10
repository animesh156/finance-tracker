"use client";

import { useState, useEffect } from "react";
import TransactionList from "@/components/TransactionList";
import ExpenseChart from "@/components/ExpenseChart";
import TransactionForm from "@/components/TransactionForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // State to control modal

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);

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

      {/* Content Wrapper */}
      {/* Content Wrapper */}
<div className="mt-8   grid grid-cols-1 md:grid-cols-2 gap-6">
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
