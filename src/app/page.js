"use client";

import { useState, useEffect } from "react";
import TransactionList from "@/components/TransactionList";
import ExpenseChart from "@/components/ExpenseChart";
import TransactionForm from "@/components/TransactionForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import CategoryPieChart from "@/components/CategoryChart";
import BudgetForm from "@/components/BudgetForm";
import SpendingInsights from "@/components/SpendingInsights";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";



export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // State to control modal
  const [budgetModalOpen, setBudgetModalOpen] = useState(false)

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data));

      fetch("/api/budgets")
      .then((res) => res.json())
      .then((data) => setBudgets(data));


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
      <div className="flex gap-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="md:w-48 w-36 bg-blue-600 hover:cursor-pointer hover:bg-blue-500">+ Add Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm setTransactions={setTransactions} setIsOpen={setIsOpen} />
          </DialogContent>
        </Dialog>

        <Dialog open={budgetModalOpen} onOpenChange={setBudgetModalOpen}>
          <DialogTrigger asChild>
            <Button className="md:w-48 w-36 bg-green-600 hover:cursor-pointer hover:bg-green-500">📊 Set Budget</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Monthly Budget</DialogTitle>
            </DialogHeader>
            <BudgetForm setBudgets={setBudgets} setBudgetModalOpen={setBudgetModalOpen} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards Section */}
      <div className="mt-8   flex flex-col lg:flex-row mb-4 gap-y-3 justify-around w-full">
       
        {/* Recent Transactions */}
        <Card className="border xl:w-96  shadow-md">
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


        {/* Expenses by Category */}
        <Card className="border xl:w-96   shadow-md">
        
            <h2 className="text-sm font-semibold ml-3 text-gray-700 dark:text-white">Category Breakdown</h2>
            <CategoryPieChart transactions={transactions} setTransactions={setTransactions} />
         
        </Card>

       
        
      </div>


<div className="flex flex-col lg:flex-row gap-y-3 gap-x-4">

<SpendingInsights transactions={transactions} budgets={budgets} />
       
       {/* Total Expenses */}
       <Card className="border   shadow-md">
         <CardContent className="md:mt-12  text-center">
           <h2 className="xl:text-3xl md:text-xl font-semibold text-gray-700 dark:text-white">Total Expenses</h2>
           <p className="xl:text-2xl md:text-xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p>
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


   

     

    
{/* Budget vs. Actual Chart */}
<Card className="border shadow-md mt-6">
  <CardContent>
    <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Budget vs. Actual</h2>
    <div className="w-full overflow-x-auto">
      <div className=" xl:w-[900px] md:w-[680px] w-[319px] h-auto "> {/* Fixed width based on screen size */}
        <ResponsiveContainer width="100%" height={370} >
          <BarChart 
            data={budgets.map((b) => ({
              category: b.category,
              budget: b.amount,
              actual: transactions
                .filter((t) => t.category === b.category)
                .reduce((sum, t) => sum + t.amount, 0),
            }))}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <XAxis dataKey="category" className="xl:text-md md:text-sm text-[6px]"  textAnchor="end" interval={0} />
            <YAxis />
            <Tooltip />
            <Legend  />
            
            <Bar dataKey="budget" margin={{top:20}}   fill="#8884d8" />
            <Bar dataKey="actual" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </CardContent>
</Card>


    </div>
  );
}
