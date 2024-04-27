const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// MongoDB functionalities
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nkzn5jr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // Create new database with collection
    const Art_And_Craft_Collection = client
      .db("ArtAndCraft")
      .collection("ArtAndCraftItems");
    const usersCollection = client.db("ArtAndCraft").collection("UsersData");

    // Add Art and Craft information in database (Using post method)
    app.post("/artsandcrafts", async (req, res) => {
      const newArtAndCraft = req.body;
      const result = await Art_And_Craft_Collection.insertOne(newArtAndCraft);
      res.send(result);
    });
    // Get user data from client side and add user data in database

    app.post("/user", async (req, res) => {
      const userData = req.body;
      const result = await usersCollection.insertOne(userData);
      res.send(result);
    });
    // Get all the art and craft information from database

    app.get("/artsandcrafts", async (req, res) => {
      const cursor = Art_And_Craft_Collection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get single data from database
    app.get("/artsandcrafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await Art_And_Craft_Collection.findOne(query);
      res.send(result);
    });
    // Update an Art and Craft
    app.put("/updateArtCraft/:id", async (req, res) => {
      const id = req.params.id;
      const updatedDataOfArtAndCraft = req.body;
      
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedArtAndCraft = {
        $set: {
          item_name: updatedDataOfArtAndCraft.item_name,
          subcategory: updatedDataOfArtAndCraft.subcategory,
          description: updatedDataOfArtAndCraft.description,
          price: updatedDataOfArtAndCraft.price,
          rating: updatedDataOfArtAndCraft.rating,
          photo: updatedDataOfArtAndCraft.photo,
          processingTime: updatedDataOfArtAndCraft.processingTime,
          customization: updatedDataOfArtAndCraft.customization,
          inStock: updatedDataOfArtAndCraft.inStock,
        },
      };
      const result = await Art_And_Craft_Collection.updateOne(
        filter,
        updatedArtAndCraft,
        options
      );
      res.send(result);
    });

    // Delete an Art or Craft using unique _id

    app.delete("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await Art_And_Craft_Collection.deleteOne(query);
      res.send(result);
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
