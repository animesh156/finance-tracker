import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Get all transactions
export async function GET() {
  try {
    const db = await connectDB();
    const transactions = await db.collection("transactions").find({}).toArray();
    return Response.json(transactions, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

// Add a new transaction
export async function POST(req) {
  try {
    const db = await connectDB();
    const { amount, date, description } = await req.json();
    const result = await db.collection("transactions").insertOne({ amount, date, description });
    return Response.json({ _id: result.insertedId, amount, date, description }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to add transaction" }, { status: 500 });
  }
}

// Update a transaction
export async function PUT(req) {
  try {
    const db = await connectDB();
    const { id, amount, date, description } = await req.json();

    if (!id) {
        return Response.json({ error: "Missing transaction ID" }, { status: 400 });
      }

      const updatedTransaction = await db.collection("transactions").updateOne(
        { _id: new ObjectId(id) },
        { $set: { amount, date, description } }
      );
  
      if (updatedTransaction.matchedCount === 0) {
        return Response.json({ error: "Transaction not found" }, { status: 404 });
      }
  
      return Response.json({ message: "Transaction updated successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error updating transaction:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Delete a transaction (Uses URL Params)
export async function DELETE(req) {
    try {
      const db = await connectDB();
      const { id } = await req.json();
  
      if (!id) {
        return Response.json({ error: "Missing transaction ID" }, { status: 400 });
      }
  
      const result = await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });
  
      if (result.deletedCount === 0) {
        return Response.json({ error: "Transaction not found" }, { status: 404 });
      }
  
      return Response.json({ message: "Transaction deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
