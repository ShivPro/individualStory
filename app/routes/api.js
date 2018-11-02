var User = require('../modules/user');

var Story = require('../modules/story');

var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');


// destination A anything before the middleware is destination A and we have to go to B from here and middleware is the apporval stage from A to B

function createToken(user){
	var token = jsonwebtoken.sign({
		_id: user._id,
		name:user.name,
		username:user.username
	}, secretKey, {
		expiresInMintute : 1400
	
	});
	return token;
}

module.exports =function(app, express, io) {

	var api = express.Router();

	api.get('/all_stories', function(req , res){
		Story.find({}, function(err, stories){
			if(err){
				res.send(err);
				return;
			}
				res.json(stories);
			
		});
	});

	api.post('/signup' , function(req , res){

		var user = new User ({
		name: req.body.name,
		username: req.body.username,
		password: req.body.password
	});
		var token = createToken(user);
	user.save(function(err){
	if(err){
		res.send(err);
		return;
	}
	res.json({
		sucess: true;
		message : 'User has been created!',
		token:token});
});
	});
	api.get('/users', function(req, res){
		User.find({},function(err, users){
			if(err){
				res.send(err);
				return;
			}
			res.json(users);
		});
	});

	api.post('/login', function(req, res){
		User.findOne({
			username: req.body.username
		}).select('name username password').exec(function(err,user){
			if(err) throw err;

			if(!user) {
				res.send({message:"User does not exist"});
			}else if(user){
				var validPassword = user.comparedPassword(req.body.password)
				if (!validPassword){
					res.send({message:"Invalid Password"});
				}else {
					/////token
					var token = createToken(user);

					res.json({
						success : true,
						message : "Successful login!",
						token : token

					});

				}
			}
		});
	});

//middleware created to test the token i.e token validation
	api.use(function(req, res , next){

		console.log("Somebody just came to our app!");

		var token = req.body.token || res.param('token') || req.headers['x-access-token'];

		//check if token exist
		if (token) {
			jsonwebtoken.verify(token , secretKey , function(err ,decoded){
				if(err){
					res.status(403).send({sucess: false,message : "Failed to authentication user"});

				} else {
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.status(403).send({ sucess : false , message: "No Token Provided"});
		}
	});

// Destination B and to get here we need a valid token

//api.get('/', function(req, res){
//	res.json("Hello World");
//});

api.route('/')
	.post(function(req ,res){

		var story = new Story({
			creator : req.decoded.id,
			content : req.body.content,

		});

		story.save(function(err,newStory)
			if(err)
			{
				res.send(err);
				return

			}
			io.emit('story',newStory)
			res.json({message: "New Story created!"});
		});

	})
	.get(function(req, res){
		Stroy.find({creator:req.decoded.id}, function(err,stories){
			if(err){
				res.send(err);
				return;
			}
			res.json(stories);
		});
	});

	api.get('/me',function(req, res){
		res.json(req.decoded);
	})
	return api




}