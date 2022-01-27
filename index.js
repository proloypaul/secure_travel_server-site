const { MongoClient } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 3600;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e3dsx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri)
async function run() {
    try {
      await client.connect();
      const database = client.db('travelerExp')
      const exprerienceCollection = database.collection('experience')
      
      // collect blog data from database
      app.get('/blogs', async(req, res) => {
        const cursor = exprerienceCollection.find({})
        const result = await cursor.toArray()
        // console.log("collect blogs data")
        res.json(result)
      })
     app.get('/blogs/:id', async(req, res) => {
       const Id = req.params.id
      //  console.log("single blog id", Id)
      const query = {_id: ObjectId(Id)}
      const result = await exprerienceCollection.findOne(query)
      res.json(result)
      // console.log("single data find result", result)
     })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("secure travel server running")
});

app.listen(port, () => {
    console.log(`secure travel port number ${port}`)
})