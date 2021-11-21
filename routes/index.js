var express = require('express');
var router = express.Router();
// Route -> /

router.get('/', function(req, res, next) {
  res.send({status: 413,msg: "POST to /records to test the example."});
});

module.exports = router;
