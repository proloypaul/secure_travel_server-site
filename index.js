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
      const usersCollection = database.collection('users') 
      const exprerienceCollection = database.collection('experience')
      
      // POST all user data in database
      app.post('/users', async(req, res) => {
        const data = req.body 
        const result = await usersCollection.insertOne(data)
        res.json(result)
        console.log("user data result", result)
      })

      // PUT method to update user when signIn with google
      app.put('/users', async (req, res) => {
        const user = req.body 
        const filter = {email: user.email}
        const options = {upsert: true} 
        const updateDoc = {$set: user}
        const result = await usersCollection.updateOne(filter, updateDoc, options)
        res.json(result)
      })

      // put method to update user with admin
      app.put('/users/admin', async (req, res) => {
        const admin = req.body
        console.log(admin.email)
        // console.log("admin data", admin)
        const filter = {email: admin.email} 
        const updateDoc = {$set: {role: "admin"}}
        const result = await usersCollection.updateOne(filter, updateDoc)
        // console.log("update user result", result)
        res.json(result)
      })

      app.get('/users/:email', async (req, res) => {
        const email = req.params.email
        // console.log("user email", email)
        const query = {email: email}
        const result = await usersCollection.findOne(query)
        let isAdmin = false 
        if(result?.role === "admin"){
            isAdmin = true 
        }
        res.json({admin: isAdmin})
    })
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

    //  post user experience in same collection
    app.post('/blogs', async (req, res) => {
      const travelerData = req.body 
      // console.log(productData)
      const result = await exprerienceCollection.insertOne(travelerData)
      res.json(result)
      console.log("user data added result", result)
    })

    app.delete('/blogs/:id', async (req, res) => {
      const id = req.params.id 
      const query = {_id: ObjectId(id)}
      const result = await exprerienceCollection.deleteOne(query)
      console.log(result)
      res.json(result)
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

// heroku main: https://secret-depths-81352.herokuapp.com/ 