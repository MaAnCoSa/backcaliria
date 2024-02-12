const cors = require('cors')
const express = require("express");
const app = express();
const PORT = 8080;
const AWS = require('aws-sdk')
const { getStates, getStateById, addOrUpdateState, deleteStateById } = require('./dynamo.js')






app.use( express.json() )

const options = [
    cors({
        origin: '*',
        methods: '*',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    })
];

app.use(options)

app.listen(
    PORT,
    () => console.log(`ALIVEEE on http://localhost:${PORT}`)
)

let digit1 = 1;
let digit2 = 1;
let digit3 = 1;
let digit4 = 1;
let digit5 = 1;

app.get('/rtsol', async (req, res) => {
    const response = await getStateById("rt")
    const item = response.Item
    res.status(200).send({
        id: item.id,
        digit1: item.digit1,
        digit2: item.digit2,
        digit3: item.digit3,
        digit4: item.digit4,
        digit5: item.digit5,
        clave: item.clave,
        message: item.message
    })
});

app.post('/rtsol', (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      )
    const { sol } = req.body;

    const newState = {
        "id": "rt",
        "digit1": sol.digit1,
        "digit2": sol.digit2,
        "digit3": sol.digit3,
        "digit4": sol.digit4,
        "digit5": sol.digit5,
        "clave": sol.clave,
        "message": sol.message
    }

    addOrUpdateState(newState);

    res.send({
        newCombination: `${sol.digit1}${sol.digit2}${sol.digit3}${sol.digit4}${sol.digit5}`,
        newClave: `${sol.clave}`,
        newMessage: `${sol.message}`
    })
})