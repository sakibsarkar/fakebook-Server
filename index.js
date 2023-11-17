require('dotenv').config()
const express = require("express")
const cors = require("cors")
const port = process.env.PORT || 5000
const app = express()
const jwt = require("jsonwebtoken")



app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))
app.use(express.json())

const varifyToekn = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).send({ message: "unAuthorized access" })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "forbiden Access" })
        }
        req.user = decoded
        next()
    })
}








const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.xbiw867.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection

        const postCollection = client.db("Fakebook").collection("posts")


        // set Token api
        app.post("/api/user/token", async (req, res) => {
            const email = req.body

            const token = jwt.sign(email, process.env.ACCESS_TOKEN, { expiresIn: "365d" })

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            }).send({ message: "success" })

        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("hello")
})

app.listen(port)