var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
let port = process.env.PORT || 5000;
var path = require('path');
const app = express();

app.use(express.static('www'));
app.use(express.static(path.join('www', 'build')));

app.use(bodyParser.json());


var connectionString = process.env.DATABASE_URL || '5000';

if (process.env.DATABASE_URL !== undefined) {
    pg.defaults.ssl = true;
  }

var client = new pg.Client(connectionString);
client.connect();


var email = 'Email';
//perform a query 
client.query('Select Id, Email From salesforce.Contact', (err, data)=>{
    var schema = 'salesforce.';
    email = schema + 'Email';
})

app.get('/contacts', (req, res)=>{
    
    client.query('SELECT Id, SfId'+email+'From salesforce.Contact',(error, data)=>{
        if(data.contains(email)){
            res.send(data.sfid)
        }else{
            app.post('/', (req,res)=>{
                res.send( { 'Name': 'New Contact'});
            })
        }
       
    });
});

app.patch('/contacts/update' , (req, res)=>{
    
})






       


    







app.listen(port, ()=>{
    console.log('The app is listening on port http://localhost:'+ port);
})