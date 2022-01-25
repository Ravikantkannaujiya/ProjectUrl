const express = require('express');
const router = express.Router();
const urlController = require("../controllers/urlController");


router.post("/urlshorten",urlController.urlShortner);
router.get("/:urlCode",urlController.geturl);




module.exports = router;