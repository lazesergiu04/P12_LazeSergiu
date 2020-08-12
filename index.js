var express = require('express');
const app = express();
let port = process.env.PORT || 5000;
  
var path = require('path');

var bodyParser = require('body-parser');
var pg = require('pg');


app.use(express.static('www'));
app.use(express.static(path.join('www', 'build')));

app.use(bodyParser.json());


var connectionString = process.env.DATABASE_URL || '5000';



var client = new pg.Client(connectionString);
client.connect();



// Check if the email exist in Salesforce Database
//if true-> send Salesforce id
//if false -> create contact and send Salesforce Id

app.get('/contacts/{email}', (req, res)=>{
    client.query('SELECT Email, SfId From salesforce.Contact',(error, data)=>{
        if(data.contains(email)){
            //send Salesforce Id
            res.send(sfid);
        }else{
            //Create a record in Salesforce 
            app.put('/', (req, res)=>{
                res.send(
                    {
                        "Name": "Contact"
                    }, sfid
                )
            })


        }
    })
    
})

app.get('/accounts/new', (req, res)=>{
    rest.api(req).describe('Account', (data)=>{
        res.render('new', {title: "New Account", data: data})
    });
});





app.listen(port, ()=>{
    console.log('The app is listening on port http://localhost:'+ port);
})