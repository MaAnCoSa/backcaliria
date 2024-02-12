const AWS = require('aws-sdk')
require('dotenv').config()

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "caliria-combinaciones";

const getStates = async () => {
    const params = {
        TableName: TABLE_NAME
    }
    const combinations = await dynamoClient.scan(params).promise()
    console.log(combinations)
    return combinations
}

const getStateById = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id }
    }
    return await dynamoClient.get(params).promise()
}

const addOrUpdateState = async (state) => {
    const params = {
        TableName: TABLE_NAME,
        Item: state
    }
    return await dynamoClient.put(params).promise()
}

const deleteStateById = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id }
    }
    return await dynamoClient.delete(params).promise()
}

module.exports = {
    getStates,
    getStateById,
    addOrUpdateState,
    deleteStateById
}