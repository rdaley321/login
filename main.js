const express = require('express');
const app = express()
const mustache = require('mustache-express');
const session = require('express-session')
const bodyParser = require('body-parser')
const parseurl = require('parseurl')

app.set('views', __dirname + '/views')
app.engine('mustache', mustache() )
app.set('view engine', 'mustache');

app.listen(3000, function(){
  console.log("ok cool, listening!")
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(function (req, res, next) {
  var views = req.session.views
  if (!views) {
    views = req.session.views = {}
  }
  var pathname = parseurl(req).pathname
  views[pathname] = (views[pathname] || 0) + 1

  next()
})


var sess
var database= [{username: 'ryan', password: 'password123'}]
var invalidPassword = ''
var userTrue = 0
app.get('/', function(req, res, next){
  sess= req.session
  for (var i = 0; i < database.length; i++) {
    if(database[i].username === sess.username && database[i].password === sess.password) {
      userTrue = 1
    }
  }
  if(userTrue === 1) {
    res.render('index', {
      user: sess.username,
      pass: sess.password,
      views: (sess.views['/count'])
    })
  } else {
    res.redirect('/login')
  }
})

app.get('/login', function(req, res, next){
  res.render('login', {
    invalid: invalidPassword
  })
});

app.post('/login', function(req, res){
  sess = req.session
  sess.username = req.body.username
  sess.password = req.body.password
  for (var i = 0; i < database.length; i++) {
    if(database[i].username === sess.username && database[i].password === sess.password) {
      res.redirect('/')
    } else if(database[i].username === sess.username && database[i].password !== sess.password) {
      invalidPassword = 'Your password was incorrect'
      res.redirect('/login')
    }
  }
  res.redirect('/signup')
});
app.get('/signup', function(req, res){
  res.render('signup')
})
app.post('/signup', function(req,res){
  sess = req.session
  sess.username = req.body.username
  sess.password = req.body.password
  let newUser = {username: sess.username, password: sess.password}
  database.push(newUser)
  res.redirect('/')

})
app.post('/counter', function(req,res){
  res.redirect('/count')
})
app.get('/count', function(req,res,next){
  res.redirect('/')
})

app.post('/logout', function(req,res){
  userTrue = 0
  sess = req.session
  sess.username = ''
  sess.password = ''
  invalidPassword = ''
  sess.views['/count'] = 0
  res.redirect('/')
})
app.post('/create', function(req,res){
  res.redirect('/signup')
})
