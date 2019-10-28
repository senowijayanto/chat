const express = require('express');
const app = express();

app.use(express.static(__dirname));

var server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port)
})