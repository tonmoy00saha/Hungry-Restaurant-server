const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.szqv4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("HungryDB").collection("menu");
    const reviewCollection = client.db("HungryDB").collection("reviews");
    const cartCollection = client.db("HungryDB").collection("carts");
    app.get('/menu', async(req,res)=>{
        const result = await menuCollection.find().toArray();
        res.send(result);
    })
    app.get('/review', async(req,res)=>{
        const result = await reviewCollection.find().toArray();
        res.send(result);
    })

    // Carts Collection

    app.post('/carts', async(req,res)=>{
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('boss is sitting');
})

app.listen(port, ()=>{
    console.log(`Hungry Boss is sitting on port ${port}`);
})


/***
 * ----------------------
 *    Naming Convention
 * ----------------------
 *    app.get('/users')
 *    app.get('/users/:id')
 *    app.post('/users')
 *    app.put('/users/:id')
 *    app.patch('/users/:id')
 *    app.delete('/users/:id')
 * 
 * **/ 