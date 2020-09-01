const PORT = process.env.PORT || 3001;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/userSchema');
const Contents = require('./models/contentsSchema');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");

// public 폴더 내 소스 사용을 위함 (html, css, 이미지 등)
app.use(express.static('public')) 

// 프론트엔드 파싱 위함
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json());

// create server from Heroku
app.listen(PORT);

// connect web server - DB
const dbURI = 'mongodb+srv://woojun-kang:1234@my-first-cluster.9pf89.mongodb.net/twittler?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log('connected to db'))
  .catch((err) => console.log(err));


/* set router & api */
app.get('/', (req, res) => {
  res.sendFile('./index.html', {root : __dirname });
})

// get all TWEET from DB
app.get('/contents', (req, res) => { 
  Contents.find({is_deleted: false})
  .sort({created_at:'desc'})
  .exec((err, docs) => {
    if(err){
      console.log(err);
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
    {is_deleted: true,
     deleted_at: new Date()},
    function(err, result) {
      if(err){
        res.send(err);
      } else {
        res.send(result);
      }
    }
  )
})




