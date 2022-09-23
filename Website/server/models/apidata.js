const mongoose = require("mongoose");
const Joi = require("joi");
const router = require("express").Router();

const dataSchema = new mongoose.Schema({
	time: { type: String, required: true },
	topic: { type: String, required: true },
	value: { type: String, required: true },
});




const Data = mongoose.model("data", dataSchema);
const validate = (data) => {
	const schema = Joi.object({
		time: { type: String, required: true },
		topic: { type: String, required: true },
		value: { type: String, required: true },
	});
	return schema.validate(data);
};
module.exports = { Data, validate };