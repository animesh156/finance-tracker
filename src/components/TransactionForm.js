"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Utility function for conditional classNames
import axios from "axios";


export default function TransactionForm({ setTransactions, setIsOpen }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Other");
  const [error, setError] = useState(""); // State for validation errors

  const categories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
  
    // Validation checks
    if (!amount || parseFloat(amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (!description.trim()) {
      setError("Description cannot be empty.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }
  
    setLoading(true);
    setError(""); // Clear previous errors
  
    // **Optimistic UI Update**: Add the transaction to state before API call
    const newTransaction = {
      amount: parseFloat(amount),
      description,
      date,
      category, // Ensure category is set correctly
      _id: Date.now(), // Temporary ID to prevent React key issues
    };
  
    setTransactions((prev) => [...prev, newTransaction]);
   
  
    try {
      // **Make API request to save transaction in DB**
      const { data: savedTransaction } = await axios.post("/api/transactions", {
        amount: parseFloat(amount),
        description,
        date,
        category,
      });
  
      // **Replace temporary transaction with saved one**
      setTransactions((prev) =>
        prev.map((t) => (t._id === newTransaction._id ? savedTransaction : t))
      );
  
      // Reset form fields
      setAmount("");
      setDescription("");
      setDate("");
      setCategory("Other");
  
      // Close modal after successful submission
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError("Failed to add transaction. Please try again.");
  
      // **Revert UI Update** if the request fails
      setTransactions((prev) => prev.filter((t) => t._id !== newTransaction._id));
    }
  
    setLoading(false);
  };
  

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>} {/* Error message */}

          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
            className={error.includes("Amount") ? "border-red-500" : ""}
          />
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            className={error.includes("Description") ? "border-red-500" : ""}
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={error.includes("date") ? "border-red-500" : ""}
          />

          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={cn(
                "block w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary",
                "focus:outline-none"
              )}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
