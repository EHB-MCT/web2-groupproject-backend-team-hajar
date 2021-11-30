const fs = require('fs/promises')

//express
const express = require('express')();
const app = express;
const port = 3000;

//middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//mongo config
const {MongoClient} = require('mongodb');
const config = require('./config.json')
  //new mongo client
const client = new MongoClient(config.baseUrl);


//Root route
app.get('/', (req,res) => {
  res.send("Alles goed");
})


//Return all challenges from db
app.get('/challenges', async (req,res) => {

  try {
    //connect db
    await client.connect();

    //retrieve challeng data
    const coll = client.db('S7:Team-Hajar').collection('challenges')
    const challenges = await coll.find({}).toArray();

    //send back the file
    res.status(200).send(challenges)
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "something went wrong",
      value: error
    })
  }
  
})

//Save challenges from db
app.post('/challenges', async (req,res) => {
  
})

//Put challenges from db
app.put('/challenges', async (req,res) => {
  
})

//Delete challenges from db
app.delete('/challenges', async (req,res) => {
  
})



app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
})