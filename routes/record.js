var express = require('express');
var router = express.Router();
var {createRecordResponse} = require("../controllers/record");
// Route -> /records

router
    .route('/')
    .post(createRecordResponse);

module.exports = router;
