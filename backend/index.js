const fs = require('fs/promises')

//express
const express = require('express')();
const app = express;
const port = process.env.PORT || 3000;

//middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//mongo config
const {MongoClient, ObjectId} = require('mongodb');
const config = require('./config.json')
//new mongo client
const client = new MongoClient(config.baseUrl);


//Root route
app.get('/', (req,res) => {
  res.send("Alles goed");
})

//app routes
app
//GET all challenges from db
.get('/challenges', async (req,res) => {

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

//GET all challenges:ID from db
.get('/challenges/:id', async (req,res) => {
  //id is located in the query: req.params.id

  try {
    //connect db
    await client.connect();

    //retrieve challeng data
    const coll = client.db('S7:Team-Hajar').collection('challenges')
    // const challenges = await coll.find({}).toArray();

    //only look for a challenge with id
    const query = {_id: ObjectId(req.params.id)};

    const challenge = await coll.findOne(query)

    if(challenge){
      //send back the file
      res.status(200).send(challenge);
      return;
    } else {
      res.status(400).send("Challenge could not be found with id " + req.params.id)
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "something went wrong",
      value: error
    })
  }
  
})

//POST challenges from db
.post('/saveChallenges', async (req,res) => {
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
    res.status(201).json(newChallenge)
    return;
    
  } catch (error) {
    console.log(error);
    res.status(500).send("An error has occured")
  } finally {
    await client.close()
  }
  
})

//Put challenges from db
.put('/updateChallenges/:id', async (req,res) => {
  try {
    //connect db
    await client.connect();

    //retrieve challenge data
    const coll = client.db('S7:Team-Hajar').collection('challenges')

    //only look for a challenge with id
    const query = {_id: ObjectId(req.params.id)};

    const updateDocument = {
      $set: {
          name: req.body.name,
          // points: req.body.points,
          // course: req.body.course,
          // session: req.body.session,
      }
  };

    await coll.updateOne(query,updateDocument) 
    res.status(200).json({
      message: 'Succesfully Updated Challenge: ' + req.body.name
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "something went wrong",
      value: error
    })    
  }

  
})

//Delete challenges from db
.delete('/deleteChallenges/:id', async (req,res) => {
  //id is located in the query: req.params.id
  try {
    //connect db
    await client.connect();

    //retrieve challenge data
    const coll = client.db('S7:Team-Hajar').collection('challenges')
    // const challenges = await coll.find({}).toArray();

    //only look for a challenge with id
    const query = {_id: ObjectId(req.params.id)};

    //DELETE challenge
    await coll.deleteOne(query)
    res.status(200).json({
      message: 'Succesfully Deleted!'
    });

    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "something went wrong",
      value: error
    })
  }
})



app.listen(port, () => {
  console.log(`REST API is running at http://localhost:${port}`);
})