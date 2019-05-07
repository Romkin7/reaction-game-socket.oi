const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
	username: {type: String, unique: true, required: true},
	results: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "result"
		}
	]
}, {
	usePushEach: true,
	timestamps: true
});
module.exports = mongoose.model("user", userSchema);