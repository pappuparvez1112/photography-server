const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const fileUpload = require('express-fileupload');

require('dotenv').config();
// const ObjectID = require('mongodb').ObjectID;

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.static('photographer'));
app.use(fileUpload());
console.log(process.env.DB_USER)

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p4mie.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const photographycollection = client.db("photography").collection("photographers");
  const clientscollection = client.db("photography").collection("clients");
  // perform actions on the collection object
  // client.close();



  // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p4mie.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  // // console.log(uri);
  // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  // client.connect(err => {
  //   console.log('connection err', err)
  //   const photographerCollection = client.db("photography").collection("photographers");
  //   //   const orderscollection = client.db("freshValley").collection("orders");
  //   console.log('connected');
  // perform actions on the collection object
  // client.close();

  app.get('/photographers', (req, res) => {
    photographycollection.countDocuments().then(res => {
      console.log(res)
    })
    photographycollection.find()
      .toArray((err, documents) => {
        console.log(documents)
        res.send(documents)
      })
  })
  app.get('/clients', (req, res) => {
    clientscollection.countDocuments().then(res => {
      console.log(res)
    })
    clientscollection.find()
      .toArray((err, documents) => {
        console.log(documents)
        res.send(documents)
      })
  });

  app.get('/photographerss', (req, res) => {
    photographycollection.find()
      .toArray((err, documents) => {
        const pic_data = documents[0].file.data
        res.send(`<img src="data:image/png;base64,${pic_data}" />`)
      })

  })


  //   app.get('/products/:id',(req,res)=>{
  //     const id=req.params.id;
  //     productcollection.find({_id:ObjectID(id)})
  //     .toArray((err,items)=>{
  //       res.send(items[0])
  //       // console.log('from database',items)
  //     })
  //   })   

  app.post('/addPhotographer', (req, res) => {
    const file = req.files.file;
    const file_path = '/' + file.name;
    const name = req.body.name;
    const email = req.body.email;
    console.log(name, file_path, email);
    file.mv(`${__dirname}/photographer/${file.name}`, err => {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: 'failed to load' });
      }
      photographycollection.insertOne({
        file_path,
        name,
        email
      })
      return res.send({ name: file.name, path: `/${file.name}` })
    })


  });
  app.post('/addClients', (req, res) => {
    const file = req.files.file;
    const file_path = '/' + file.name;
    const name = req.body.name;
    const description = req.body.description;
    const text = req.body.text;
    console.log(name, file_path, description, text);
    file.mv(`${__dirname}/clients/${file.name}`, err => {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: 'failed to load' });
      }
      clientscollection.insertOne({
        file_path,
        name,
        description,
        text
      })
      return res.send({ name: file.name, path: `/${file.name}` })
    })


    // photographercollection.insertOne(photographer,(err,result)=>{
    //   console.log('inserted count',result.insertedCount);
    //   res.send({count:result.insertedCount});
    // })
  });








  //   app.post('/addProduct',(req,res)=>{
  //     const newProduct=req.body;
  //     console.log('adding product',newProduct);
  //     productcollection.insertOne(newProduct)
  //     .then(result=>{
  //       console.log('inserted count',result.insertedCount);
  //       res.send(result.insertedCount>0)
  //     })
  //   })

  //   app.delete('/deleteorder/:id',(req,res)=>{
  //     const id=req.params.id;
  //     orderscollection.deleteOne({_id:ObjectID(id)},(err)=>{
  //       if(!err){
  //         res.send({count:1})
  //       }
  //     })
  //   })

});

  app.listen(process.env.PORT || port);