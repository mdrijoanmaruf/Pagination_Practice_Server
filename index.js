const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const {
  MongoClient,
  ServerApiVersion,
  ConnectionPoolMonitoringEvent,
  ObjectId,
} = require("mongodb");

const uri = `mongodb+srv://libraryManagement:V64snpiDvEnF6Fqk@cluster0.0ykpaho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const productCollection = client.db("emaJohnDB").collection("products");

    app.get("/products", async (req, res) => {
      // console.log("Pagination Query : " , req.query);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const result = await productCollection
        .find()
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

    app.post("/productsByIds", async (req, res) => {
      const ids = req.body;

      const idsWithObjectID = ids.map((id) => new ObjectId(id));

      const query = {
        _id: {
          $in: idsWithObjectID,
        },
      };
      const result = productCollection.find(query)
      console.log(idsWithObjectID);
      res.send(result);
    });

    // Get Total Products number
    app.get("/productsCount", async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("john is busy shopping");
});

app.listen(port, () => {
  console.log(`ema john server is running on port: ${port}`);
});
