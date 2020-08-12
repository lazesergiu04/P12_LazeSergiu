var express = require('express');
const app = express();
let port = process.env.PORT || 5000;

app.get('/', (req, res)=>{
    res.send('This is a test');
})


app.listen(port, ()=>{
    console.log('The app is listening on port http://localhost:'+ port);
})