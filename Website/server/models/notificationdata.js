const mongoose = require("mongoose");
const Joi = require("joi");

const notfificationSchema = new mongoose.Schema({
	time: { type: String, required: true },
	topic: { type: String, required: true },
	value: { type: String, required: true },
});




const Notfification = mongoose.model("notifications", notfificationSchema);
const validate = (notfification) => {
	const schema = Joi.object({
		time: { type: String, required: true },
		topic: { type: String, required: true },
		value: { type: String, required: true },
	});
	return schema.validate(notfification);
};
module.exports = { Notfification, validate };