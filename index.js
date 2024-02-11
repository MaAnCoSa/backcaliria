const express = require("express");
const app = express();
const PORT = 8080;

app.use( express.json() )

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
    const { sol } = req.body;

    if (!sol) {
        res.status(418).send({ message: 'No new solution sent!' })
    }

    console.log(sol)

    digit1 = sol.digit1
    digit2 = sol.digit2
    digit3 = sol.digit3
    digit4 = sol.digit4
    digit5 = sol.digit5

    res.send({
        newsol: `message received: ${digit1}${digit2}${digit3}${digit4}${digit5}`
    })
})