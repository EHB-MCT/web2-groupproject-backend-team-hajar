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
app.post('/saveChallenges', async (req,res) => {
  if(!req.body.name || !req.body.points || !req.body.course || !req.body.session)
  {
    res.status(400).send('Bad request: missing id, name, points, course, session ')
    return;
  }

  try {
    //connect db
    await client.connect();

    //retrieve challenge data
    const coll = client.db('S7:Team-Hajar').collection('challenges');
    
    // create new challenge object
    let newChallenge = {
        "name": req.body.name,
        "points": req.body.points,
        "course": req.body.course,
        "session": req.body.session,
    }

    //insert into db
    let insertResult = await coll.insertOne(newChallenge)

    //succes message
    res.status(201).send(`Challenge succesfully saved with challenge name: ${req.body.name}`)
    return;
    
  } catch (error) {
    console.log(error);
    res.status(500).send("An error has occured")
  } finally {
    await client.close()
  }
  
})

//Put challenges from db
app.put('/updateChallenge', async (req,res) => {
 
  
})

//Delete challenges from db
app.delete('/deleteChallenges', async (req,res) => {
  try {
     //connect db
     await client.connect();


    //retrieve challenge data
    const coll = client.db('S7:Team-Hajar').collection('challenges');

    coll.deleteOne({
      "_id": ObjectId(req.body._id) 
    })

    //succes message
    res.status(200).send({
      message: 'Deleted!'
    })

    
  } catch (error) {
    res.status(400).send({
      error: error
    });
  }
})



app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
})