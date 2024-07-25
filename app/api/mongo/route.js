import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  // Replace the uri string with your connection string.
  const uri =
    "mongodb+srv://nayakavik19:O2TFSAc4rntK2CBF@cluster0.oheyavz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  const client = new MongoClient(uri);

  try {
    const database = client.db("inventory-management-system");
    const movies = database.collection("inventory");

    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    const movie = await movies.find(query).toArray();

    console.log(movie);
    return NextResponse.json({ movie: movie });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
