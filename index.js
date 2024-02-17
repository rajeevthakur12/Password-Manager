const express = require('express');
const app = express();

require('dotenv').config();

require('./startup/routes')(app, express);

let port = 9000 || process.env.port || 8080

app.listen(port, ()=> {
    console.log(`Listening on PORT: ${port}`);
});

