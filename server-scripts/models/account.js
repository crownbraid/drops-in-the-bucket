var mongoose = require('mongoose')
  , passportLocalMongoose = require('passport-local-mongoose');

var Account = new mongoose.Schema({
	rooms: Array,
	email: {
		type: String,
		require: true
	}
});
Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);