const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3600;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e3dsx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)
async function run() {
    try {
      await client.connect();
      
      
     
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