const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const {GridFsStorage} = require('multer-gridfs-storage');

//testing pull into main

let currTime = new Date();


const app = express();

const Round = require('./models/roundSchema');
const Player = require('./models/playerSchema');

app.use(bodyParser.json());
app.use(methodOverride('_method'));

const mongoURI = 'mongodb+srv://Dare:Dare!VideoCluster@darevideoupload.hxfknxh.mongodb.net/?retryWrites=true&w=majority';

const conn = mongoose.createConnection(mongoURI);

var MongoClient = require('mongodb').MongoClient;



mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((result) => app.listen(5002)
    ).then(console.log("Server started"))
    .catch((err) => console.log(err))

let gfs;
let gridfsBucket
//utc is 5 hours ahead

const schedule = require('node-schedule');



let CurrDate = new Date();




let date1 = [CurrDate.getFullYear(), CurrDate.getMonth(), CurrDate.getDate(), CurrDate.getHours(), CurrDate.getMinutes(), CurrDate.getSeconds()+1, CurrDate.getMilliseconds()];

let date2 = [CurrDate.getFullYear(), CurrDate.getMonth(), CurrDate.getDate(), CurrDate.getHours(), CurrDate.getMinutes(), CurrDate.getSeconds()+60, CurrDate.getMilliseconds()];

let date3 = [CurrDate.getFullYear(), CurrDate.getMonth(), CurrDate.getDate(), CurrDate.getHours(), CurrDate.getMinutes(), CurrDate.getSeconds()+120, CurrDate.getMilliseconds()];


//let date3 = [jobDate1.getFullYear(), jobDate1.getMonth(), jobDate1.getDate(), jobDate1.getHours(), jobDate1.getMinutes(), jobDate1.getSeconds()+6, jobDate1.getMilliseconds()];

//here are our three date arrays
//for testing, we are saving this to the database and then immediately reading from it
let round1 = new Round({
  date: date1,
  roundDescription: "Round test description"
  
});

let round2 = new Round({
  date: date2,
  roundDescription: "Round test description"
  
});

let round3 = new Round({
  date: date3,
  roundDescription: "Round test description"
  
});

/*let round3 = new Round({
  date: date3,
  roundDescription: "Round test description"
  
});*/

async function innerLoop(roundNum, playerNum){
  
  //console.log("Round number: "+roundNum);
  console.log("round number: "+roundNum);
  let players = await Player.find({});
  console.log("Player name: "+players[playerNum].name+" status: "+players[playerNum].hasSubmittedCurrRound + ", "+players[playerNum].hasPassedCurrRound);
  // console.log("J index" +j);
  
  
  let currPlayer = players[playerNum];
  let id = currPlayer._id.toString();
  //console.log(currPlayer);
  if (!currPlayer.isEliminated){
      if (currPlayer.hasPassedCurrRound && currPlayer.hasSubmittedCurrRound){

        console.log(currPlayer.name+" has passed on round "+roundNum)
        

        Player.findByIdAndUpdate(id, {hasSubmittedCurrRound: 'false', hasPassedCurrRound:'false'},
          function (err, docs){
            if (err){
              console.log(err);
            }else{
             // console.log("Updated user: "+docs.name);
            }
          }
        
        )
      }else{

        Player.findByIdAndUpdate(id, {isEliminated:'true'},
          function (err, docs){
            if (err){
              console.log(err);
            }else{
              console.log(docs.name+" has just been eliminated");
            }
          }
        
        )

      }
  } else{
    console.log(currPlayer.name+" has been eliminated");
  }
}



async function checkRounds(){
  //find count of rounds 
 round1.save();
round2.save();
round3.save();


  Round.count({}).then(async (numberOfRounds)=>{

  for ( i = 0; i < numberOfRounds; i++){
    
    let rounds = await Round.find({});
    let currentRound = rounds[i];
    let roundNum = i;
    let numberOfPlayers = await Player.count({});
    let date = new Date(currentRound.date[0],currentRound.date[1], currentRound.date[2], currentRound.date[3], currentRound.date[4], currentRound.date[5], currentRound.date[6]);

    for (j = 0; j < numberOfPlayers; j++){
      let playerNum = j;
       const job = await schedule.scheduleJob(date, async function(){
            //console.log("Job scheduoled")
            innerLoop(roundNum, playerNum);
        }) 
    }
    
    


    /*let roundNum = i;

        let rounds = await Round.find({});
        let currentRound = rounds[0];
        
        let date = new Date(currentRound.date[0],currentRound.date[1], currentRound.date[2], currentRound.date[3], currentRound.date[4], currentRound.date[5], currentRound.date[6]);
        
        let numberOfPlayers = await Player.count({});*/
/*
        for (j = 0; j < numberOfPlayers; j++){
          let playerNum = j;
            const job = await schedule.scheduleJob(date, async function(){
            console.log("Job")
        })  
        */
        

          

         
        }
        

        
  });
  
    
     // let date = new Date(currentRound.date[0],currentRound.date[1], currentRound.date[2], currentRound.date[3], currentRound.date[4], currentRound.date[5], currentRound.date[6]);

  /*    const job = schedule.scheduleJob(date, async function(){
        console.log("3 seconds has elapsed");
        //now we must receive our players
        let players = await Player.find({});
        for (i=0; i<players.length; i++){
          console.log(players[i]._id);

          if(!players[i].isEliminated){
            if(players[i].hasPassedCurrRound && players[i].hasSubmittedCurrRound){
              let id = players[i]._id.toString();
              Player.findByIdAndUpdate(id, {hasSubmittedCurrRound: 'false'},
                function (err, docs){
                  if (err){
                    console.log(err);
                  }else{
                    console.log("Updated user: "+docs);
                  }
                }
              
                )
            }
          }

         
        }
        
      }) */
Round.deleteMany({}).then(function(){
      //console.log("Data deleted"); // Success
    }).catch(function(error){
      console.log(error); // Failure
    });
    }
  
  //console.log(rounds[2]);

  /**/
  //console.log(rounds);
 

checkRounds();






 conn.once('open', () => {
   gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
   bucketName: 'uploads'
 });

  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
var storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });/*
*/
// @route GET /
// @desc Loads for

app.get('/', (req, res)=>{


  
      res.sendFile(__dirname + '/views/addDare/index.html');
     

});

app.get('/players', async (req, res)=>{
  let players = await Player.find({});
  res.json(players);
})

app.post('/toggleSubmit', (req, res)=>{
  let userID = req.body._id;
  console.log(userID);
  Player.findByIdAndUpdate(userID, {hasSubmittedCurrRound:'true', hasPassedCurrRound:'true'},
          function (err, docs){
            if (err){
              console.log(err);
            }else{
              console.log(docs.name+" has been eliminated");
            }
          }
        
        )

  //here we need to edit the given user to have their hasSubmittedCurrentRound as true

})
app.post('/toggleNotSubmit', (req, res)=>{

  let userID = req.body._id;
  console.log(userID);
  Player.findByIdAndUpdate(userID, {hasSubmittedCurrRound:'false', hasPassedCurrRound:'false'},
          function (err, docs){
            if (err){
              console.log(err);
            }else{
              console.log(docs.name+" has been eliminated");
            }
          }
        
        )

  
})

app.get('/addDare', (req, res)=>{

       

  
})

app.post('/addDare', (req, res)=>{







  let round = new Round(req.body);
  round.save()
    .then((result)=>{
    })
    .catch((err)=>{
      console.log(err);
    });


});

// @route POST /upload
// @desc Uploads file to DB
app.post('/upload', upload.single('file'), (req, res)=>{
  
  
  res.redirect('/');
  
});

// @route GET /files
// @desc Display all files in JSON

app.get('/files', (req, res)=>{
  gfs.files.find().toArray((err, files)=>{

      //check if files exist
    if(!files || files.length == 0){
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    return res.json(files);
    
    
  })
})

app.get('/files/:filename', (req, res)=>{

  gfs.files.findOne({filename: req.params.filename}, (err, file)=>{

    
     if(!file || file.length == 0){
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    return res.json(file);

    
  });
  
});


//get image
app.get('/image/:filename', (req, res)=>{

  gfs.files.findOne({filename: req.params.filename}, (err, file)=>{

    
     if(!file || file.length == 0){
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // check if image
    if(1==1/*file.contentType == 'image/jpeg' || file.contentType == 'image/png'*/){
      // Read output to browser
      const readstream = gridfsBucket.openDownloadStream(file._id);
      readstream.pipe(res);
    }else{
      res.status(404).json({

        err:'Not an image'
      })
    }
    

    
  });
  
});

app.get('/video/:filename', (req, res)=>{

  gfs.files.findOne({filename: req.params.filename}, (err, file)=>{

    
     if(!file || file.length == 0){
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // check if image
    if(file.contentType == 'video/mp4'){
      // Read output to browser
      const readstream = gridfsBucket.openDownloadStream(file._id);
      readstream.pipe(res);
    }else{
      res.status(404).json({

        err:'Not a bruh'
      })
    }
    

    
  });
  
});
  


const port = 5002;



app.use(express.static('views/homePage'));
app.use(express.static('views/addDare'));
