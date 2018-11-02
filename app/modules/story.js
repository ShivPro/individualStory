var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StorySchema = new Schema({

	//creator: {type : Schema.Type.id, ref: 'User'},
	content: String,
	created: {type: Date, deafault : Date.now}

});

module.exports = mongoose.model('Story', StorySchema);

