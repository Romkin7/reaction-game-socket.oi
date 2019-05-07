const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const resultSchema = new Schema({
	player: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user"
	},
	score: {
		time: {type: Number, default: 0},
		points: {type: Number, default: 0}
	}
}, {
	timestamps: true
});
module.exports = mongoose.model("result", resultSchema);