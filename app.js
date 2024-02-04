const express = require("express");
const bodyParser = require("body-parser");
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require("mongoose");
const Event = require('./models/event')
const User = require('./models/user')
const bcrypt = require('bcryptjs')
const graphQlSchema = require('./grfql/schema/index');
const graphQlResolver = require('./grfql/resolvers/index')
const isAuth = require('./middleware/is-auth')

const app = express();


app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
})

app.use(isAuth);

app.use("/graphql", graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true
}))

const URL = "mongodb+srv://admin:Chaitanya127@cluster0.3krdkpb.mongodb.net/graphql?retryWrites=true&w=majority"
// console.log(URL)
mongoose.connect(URL)
.then(()=>{
    console.log("DB connected")
    app.listen(4000, ()=>{
        console.log("Listening on port 4000")
    });
}).catch(err => {
    console.log(err)
})



