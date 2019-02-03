const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const app = express();
require ('./startup/prod')(app);

mongoose.connect('mongodb://localhost/posts',
                {useNewUrlParser : true,
                useCreateIndex: true}).then(() => {
    console.log('Connected to DB');
}).catch(err => {
   console.error('Failed '+ err); 
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use('/img', express.static(path.join('../mean-stack-back/img')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 
    'GET, POST, PATCH, DELETE, OPTIONS, PUT');
    next();
});

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);




const port = process.env.PORT || 3000 ;

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});