const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema')
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());

mongoose.connect("mongodb+srv://name:password@graphqltest.2tqac.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
{
    useNewUrlParser : true, useUnifiedTopology:true
})
mongoose.connection.once('open',()=>{
    console.log("successfully connected with mongoose")
})


app.use('/graphql',graphqlHTTP({
schema,
graphiql:true
}));




app.listen(3001,()=>{
    console.log("app running on port 3001")
})