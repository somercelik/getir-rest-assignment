/*
    The database collection schema declarations are in this module
*/
var mongoose = require('mongoose');

var recordSchema = new mongoose.Schema(
    {
        key: {type: String, required: true},
        createdAt: {type: Date, default: Date.now(), required: true},
        counts: {type: [Number]},
        value: {type: String, required: true}
    },
    { usePushEach: true }
);

mongoose.model('record', recordSchema, 'records' );