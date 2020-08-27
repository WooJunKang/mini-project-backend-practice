const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/userSchema');
const Contents = require('./models/contentsSchema');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

// connect web server - DB

app.listen(3001);
const dbURI = 'mongodb+srv://woojun-kang:1234@my-first-cluster.9pf89.mongodb.net/twittler?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log('connected to db'))
  .catch((err) => console.log(err));


  

app.get('/', (req, res) => {
  res.sendFile('./index.html', {root : __dirname });

})


// get all TWEET from DB
app.get('/contents', (req, res) => {
  console.log(111);
  Contents.find({is_deleted: false})
  .sort({created_at:'desc'})
  .exec(function(err, docs){
    if(err){
      console.log('!!! error !!!');
    } else {
      res.json(docs);
    }
  })
})






// create TWEET 
app.post('/content', (req, res) => {
  console.dir(req);
  console.log(req.body);
  const { username } = req.body;
  const { userpw } = req.body;
  const { content } = req.body;
  const createdAt = new Date();

  // content collection
  const  newContent = new Contents({
    user_name: username,
    password: userpw,
    content: content,
    created_at: createdAt,
    is_deleted: false,
    deleted_at: null
  })

  // user collection
  const newUser = new User({
    user_name: username,
    is_admin: false
  })

  newContent.save()
  .then((result) => {
    res.send(result)
  })
  .catch((err) => {
    console.log(err);
  })

  newUser.save()
  .then((result) => {
    res.send(result)
  })
  .catch((err) => {
    console.log(err);
  })
  
  res.redirect('/')
})


// delete tweet
app.put('/delete/:id', (req, res) => {
  Contents.findByIdAndUpdate(
    { _id: req.params.id},
    {is_deleted: true},
    function(err, result) {
      if(err){
        res.send(err);
      } else {
        res.send(result);
      }
    }
  )
})




