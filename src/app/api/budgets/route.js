import { connectDB } from "@/lib/mongodb";


export async function GET() {
    try {
      const db = await connectDB();
      const month = new Date().toISOString().slice(0, 7); // YYYY-MM
      const budgets = await db.collection("budgets").find({ month }).toArray();
      return Response.json(budgets, { status: 200 });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch budgets" });
      }
}
   
  
export async function POST(req) {
  try {
    const db = await connectDB();
    const body = await req.json();

    if (!body.category || !body.amount) {
      return Response.json({ error: "Category and amount are required" }, { status: 400 });
    }

    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    const amount = parseFloat(body.amount); // Ensure amount is a number

    // Insert new budget entry (no update)
    const result = await db.collection("budgets").insertOne({
      category: body.category,
      amount,
      month,
      createdAt: new Date(),
    });

    return Response.json({ message: "Budget added successfully", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error adding budget:", error);
    return Response.json({ error: "Failed to add budget" }, { status: 500 });
  }
}