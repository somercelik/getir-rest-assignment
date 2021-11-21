// The module that has the declarations of methods that is being executed while calling "/records" route
const mongoose = require('mongoose');
const Record = mongoose.model('record');
const {
    RES_CODE_SUCC,
    RES_CODE_CLIENT_ERR,
    RES_CODE_NO_DATA
} = require("../constants/index");

/**
 * The function that validates the parameters and builds the query object for mongoDB
 * 
 * @param   {object} filter   JSON object sent in request payload
 * @returns {object}          The object that contains mongoDB query object and validation message
 */
const buildCollectionQuery = (filter) => {
    let retFilter = {};
    let fields = Object.keys(filter);
    let validationMsg, validationErrorCode;
    // We got the parameter names, we're gonna use them for acquiring the Datatype, to query the data
    for (let i = 0; i < fields.length; i++) {
        let key = fields[i];
        let value = filter[key];
        // If a parameter doesn't exist in the req payload, we're not gonna use it for filtering
        if (value) {
            if (key.includes("Date")) {
                // We should validate the date fields using a phrase like "Do we have a valid ISO8601 String?", if we don't, we should send it to client in response
                if (isValidISOString(value)) {
                    // We're setting the operand for filter query using "start" and "end" words, then we're converting the string into JS Date object
                    // so the mongoose can convert it to mongoDB Date DataType
                    let operand = key.includes("start") ? "$gt" : "$lt";
                    retFilter.createdAt = retFilter.createdAt || {};
                    retFilter.createdAt[operand] = new Date(value);
                } else {
                    validationMsg = (validationMsg || "") + "The value provided for the " + key + " attribute is not valid. ";
                }
            } else if (key.includes("Count")) {
                // Our validation for number fields is the answer of "Is this a valid number?" question (isNaN is the built-in way to achieve that)
                // In addition, if the client sends the "200" string instead of 200 number, it's going to be work as well
                if (!isNaN(value)) {
                    let operand = key.includes("min") ? "$gt" : "$lt";
                    retFilter.totalCount = retFilter.totalCount || {};
                    retFilter.totalCount[operand] = Number(value);
                } else {
                    validationMsg = (validationMsg || "") + "The value provided for the " + key + " attribute is not valid. ";
                }

            }
        }
    }
    return {
        retFilter: retFilter,
        validationErrorCode: validationErrorCode,
        validationMsg: validationMsg
    };
};

const isValidISOString = (strDate) => {
    return !isNaN(Date.parse(strDate));
}

/** 
 * If the client sends the HTTP POST /records, below code block executes and returns the response to client 
 */
module.exports.createRecordResponse = async (req, res, next) => {
    // The array that will contain the results that returned from the database
    let responseRecords = [];

    // We're sending request payload to the buildCollectionQuery function and get the validation
    // result, and the filter object to send to DB
    let { retFilter, validationMsg } = buildCollectionQuery({
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        minCount: req.body.minCount,
        maxCount: req.body.maxCount
    });
    let responseMsg;
    // If the validation message is null, then we're okay to proceed, if it's not, then client should know its fault with HTTP 400
    if (!validationMsg) {
        // In addition to "key" and "createdAt" fields, we're telling the database to calculate the sums of "counts" field and
        // return the result in "totalCount" field, after that, filter the data using "$match" with the filter object that
        // we have created
        responseRecords = await Record.aggregate(
            [
                {
                    $project: {
                        key: "$key",
                        createdAt: "$createdAt",
                        totalCount: { $sum: "$counts" }
                    }
                },
                {
                    $match: retFilter
                },
                { 
                    $unset: ["_id"] 
                }
            ]
        );
        // If no documents returned, we're returning the client that we have not found anything with the criteria it sent, with HTTP 404
        if(responseRecords.length == 0){
            responseMsg = "No records found."
            res.statusCode = 404;
            res.send({ status: RES_CODE_NO_DATA, msg: responseMsg, records: responseRecords });
        } else{
           // These three lines are not the best way to cut off the time part of the ISOString, there is a keyword in mongoDB
           // that we can format the output of date fields, but the atlas tier doesn't allow us to use it
           // btw it's $dateToString{} 
            responseRecords = responseRecords.map(rec => {
                rec.createdAt = rec.createdAt.toISOString().split("T")[0];
                return rec;
            })
            // If documents returned successfully, we're returning them to client using HTTP 200 and status 0
            res.send({ status: RES_CODE_SUCC, msg: "Success", records: responseRecords });
        }
    }else{
        res.statusCode = 400;
        responseMsg = (responseMsg || "") + validationMsg;
        res.send({ status: RES_CODE_CLIENT_ERR, msg: responseMsg, records: responseRecords });
    }

}