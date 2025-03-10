"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

export default function TransactionForm({ setTransactions, setIsOpen }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const { data: savedTransaction } = await axios.post("/api/transactions", {
        amount: parseFloat(amount),
        description,
        date,
      });

      setTransactions((prev) => [...prev, savedTransaction]);

      // Reset form
      setAmount("");
      setDescription("");
      setDate("");

      // Close modal after successful transaction
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
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
          <Input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Amount" 
            required 
          />
          <Input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Description" 
            required 
          />
          <Input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
