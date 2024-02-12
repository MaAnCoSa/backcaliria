import cors from 'cors'

const express = require("express");
const app = express();
const PORT = 8080;

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

app.get('/rtsol', (req, res) => {
    res.status(200).send({
        digit1: digit1,
        digit2: digit2,
        digit3: digit3,
        digit4: digit4,
        digit5: digit5
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

    digit1 = sol.digit1
    digit2 = sol.digit2
    digit3 = sol.digit3
    digit4 = sol.digit4
    digit5 = sol.digit5

    if (!digit1 || !digit2 || !digit3 || !digit4 || !digit5) {
        res.status(418).send({ message: 'No new solution sent!' })
    }

    res.send({
        newsol: `message received: ${digit1}${digit2}${digit3}${digit4}${digit5}`
    })
})