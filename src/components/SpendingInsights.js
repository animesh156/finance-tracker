"use client";

import { useMemo } from "react";

export default function SpendingInsights({ transactions, budgets }) {
  const insights = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalSpent: 0,
        highestCategory: "N/A",
        highestExpense: 0,
        averageTransaction: 0,
        budgetStatus: "No budget set",
      };
    }

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const categorySpending = transactions.reduce((acc, { category, amount }) => {
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});

    const highestCategory = Object.keys(categorySpending).reduce((max, category) =>
      categorySpending[category] > (categorySpending[max] || 0) ? category : max, "N/A"
    );

    const highestExpense = Math.max(...transactions.map((t) => t.amount), 0);
    const averageTransaction = totalSpent / transactions.length;

    let budgetStatus = "No budget set";
    if (budgets && budgets.length > 0) {
      const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
      budgetStatus = totalSpent > totalBudget
        ? `⚠️ Over budget by ₹${(totalSpent - totalBudget).toFixed(2)}`
        : `✅ ₹${(totalBudget - totalSpent).toFixed(2)} remaining in budget`;
    }

    return { totalSpent, highestCategory, highestExpense, averageTransaction, budgetStatus };
  }, [transactions, budgets]);

  return (
    <div className="border shadow-md p-4 rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-3">Spending Insights</h2>
      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
        <li>💰 <strong>Total Spent:</strong> ₹{insights.totalSpent.toFixed(2)}</li>
        <li>📌 <strong>Most Spent Category:</strong> {insights.highestCategory}</li>
        <li>📉 <strong>Largest Single Expense:</strong> ₹{insights.highestExpense.toFixed(2)}</li>
        <li>📊 <strong>Average Transaction:</strong> ₹{insights.averageTransaction.toFixed(2)}</li>
        <li>📝 <strong>Budget Status:</strong> {insights.budgetStatus}</li>
      </ul>
    </div>
  );
}
