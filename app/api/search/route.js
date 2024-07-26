import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const searchQuery = request.nextUrl.searchParams.get("query");
  // Replace the uri string with your connection string.
  const uri =
    "mongodb+srv://nayakavik19:O2TFSAc4rntK2CBF@cluster0.oheyavz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    const pipeline = [
      {
        $match: {
          $or: [{ slug: { $regex: searchQuery, $options: "i" } }],
        },
      },
      {
        $project: {
          _id: 0,
          slug: 1,
          quantity: 1,
          price: 1,
        },
      },
    ];

    const products = await inventory.aggregate(pipeline).toArray();
    console.log(products);

    return NextResponse.json({ products });
  } finally {
    await client.close();
  }
}
