const router = require("express").Router();
const { Notfification, validate } = require("../models/notificationdata");

router.get("/latestdata/notifications", async (req, res) => {
    try{    
        const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

        const notifications = await Notfification.find({} ).sort({'_id':-1}).limit(10);   
        if (notifications)
        return res
            .json(notifications)
        
    } catch (error) {
    console.log(error)
    };
});

module.exports = router;