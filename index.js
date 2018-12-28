var express = require("express");
var bodyParser = require('body-parser');
var path=require('path');
var app = express();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  app.use(passport.initialize());
  app.use(passport.session());



  var mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost:27017/userapp');

  var Schema = mongoose.Schema

    var userSchema = new Schema({
    username:  String,
    password: String,
    Data1:   String,
    Data2: String
  });
    userSchema.methods.validPassword = function (password) {
  if (password === this.password) {
    return true; 
  } else {
    return false;
  }
}

    var adminSchema = new Schema({
    	 username:  String,
    	 password: String
    });

      var users = mongoose.model('users', userSchema);
      var admin = mongoose.model('admin', adminSchema);
  passport.use(new LocalStrategy(
  function(username, password, done) {
    users.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));



app.get('/',function(req,res){
	users.find({},function (err, docs) {
			res.render('homepage1',{
				users: docs
			});
})
});

app.post('/register',function(req,res){
	res.render('registerhome');
});

app.post('/login',function(req,res){
	res.render('loginform');
});

app.post('/adminlogin',function(req,res){
	res.render('adloginform');
});


app.post('/user/login',
  passport.authenticate('local'),
  function(req, res) {
	res.render('showinfo',{ users:req.user
			});  
	});

app.post('/user/add', function(req, res){
	 
	users.countDocuments({ username: req.body.username}, function (err, docs) {
		if(docs==0){
			var users1=users({
		username: req.body.username,
		password: req.body.password,
		Data1: req.body.Data1,
		Data2: req.body.Data2
	});
	users1.save(function(err,doc){
		if(err) res.json(err)
			else res.render('showinfo',{ users:users1

			});
	})
		}
		else{
			res.send('this username already exists')
		}
	});

	
});

app.delete('/users/delete/:id', function(req,res){
users.findByIdAndRemove(req.params.id,function(err){
	if(err){
	console.log(err);
}
else{
res.redirect('/'); 
}
  } );

});

app.listen(3000,function(){
	console.log('Server strated on 3000');
});









