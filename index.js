const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileUpload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.erp1b.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'))
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("Hello from db it's working .... yesss")
} )


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointments");
 
   //create API
   app.post('/addAppointment', (req, res) => {
    const appointment = req.body;
    appointmentCollection.insertOne(appointment)
    .then(result => {
        res.send(result.insertedCount > 0)
    })

  })


//create API
app.post('/appointmentsByDate', (req, res) => {
    const date = req.body;
    console.log(date.date);
    appointmentCollection.find({date: date.date})
    .toArray((err, documents)=> {
        res.send(documents)
    })
    
  })
 
app.post('/addADoctor', (req, res) => {
    const file = req.files.file;
    const name = req.files.name;
    const email = req.files.email;
    console.log(name,email, file);

})





});
 
app.listen(process.env.PORT || port)