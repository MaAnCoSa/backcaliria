import cors from 'cors'
import express from "express"
const app = express();
import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const db = new pg.Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    connectionString: process.env.POSTGRES_URL ,
})

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
    process.env.PORT,
    () => {
        console.log(`ALIVEEE on http://localhost:${process.env.PORT}`)
    }
)

app.get('/rtsol/:table_id', async (req, res) => {
    const { table_id } = req.params
    const client = await db.connect();

    const result = await client.query(`SELECT comb FROM royal_tablet WHERE table_id='${table_id}'`);
    client.release()

    const combs = []
    result.rows.forEach((comb) => {
        combs.push(comb.comb)
    })

    res.status(200).json(combs)
});

app.post('/rtsol', async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      )
    const { sol } = req.body;

    const d1 = sol.d1
    const d2 = sol.d2
    const d3 = sol.d3
    const d4 = sol.d4
    const d5 = sol.d5
    const clave = sol.code
    const message = sol.msg
    const table_id = sol.table_id
    const comb_id = sol.comb_id

    const strState = `{"comb_id": "${comb_id}", "d1": ${d1}, "d2": ${d2}, "d3": ${d3}, "d4": ${d4}, "d5": ${d5}, "msg": "${message}", "code": "${clave}"}`
    const query = `UPDATE royal_tablet SET comb='${strState}' WHERE table_id='${table_id}' AND comb_id='${comb_id}'`

    console.log(query)

    const client = await db.connect()
    const result = await client.query(query);
    client.release()
    res.status(200).json(result)
})

/* LOGIN */

app.post('/rtlogin', async (req, res) => {
    const client = await db.connect();

    const { table_name, table_password } = req.body

    const result = await client.query(`SELECT table_id FROM tables WHERE table_name='${table_name}' AND table_password='${table_password}'`);
    const state = result.rows[0]

    if (result.rows.length != 0) {
        const table_id = state.table_id
        res.status(200).json({
            auth: true,
            table_id: table_id
        })
    } else {
        res.status(400).json({
            auth: false
        })
    }
    client.release()
});

app.post('/rtlogin-user', async (req, res) => {
    const client = await db.connect();

    console.log("REQ COOKIES:")
    console.log(req.cookies)

    const { table_name } = req.body

    const result = await client.query(`
        SELECT
            COMB
        FROM royal_tablet rt, "tables" t 
        WHERE rt.table_id = t.table_id AND 
            t.table_name = '${table_name}'
    `);

    const combs = []
    result.rows.forEach((comb) => {
        combs.push(comb.comb)
    })

    if (result.rows.length != 0) {
        res.status(200).json({
            auth: true,
            combs: combs
        })
    } else {
        res.status(400).json({
            auth: false
        })
    }
    client.release()
});