var express = require('express');
var bodyParser = require('body-parser');

let port = process.env.PORT || 5000;
var path = require('path');

const app = express();

app.use(express.static('www'));
app.use(express.static(path.join('www', 'build')));

app.use(bodyParser.json());

const { Client } = require('pg');
const e = require('express');
const { json } = require('body-parser');

const connectionStr= process.env.DATABASE_URL || 'postgres://expfftnffbdkvh:8afc4a8c06c78c97f53b2e25b8a0581bd6c8fdd7356a0fd06ebc2b3b91912ad8@ec2-18-210-214-86.compute-1.amazonaws.com:5432/d4v5pjn3g2jgag';


const client = new Client({
  connectionString:connectionStr,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

app.get('/', (req, res)=>{
  client.query(`Select * from salesforce.Contact`, (err, data)=>{
    res.json(data);
  })
})

//Get the Contact records ( email, id, sfId)
var emailInDB =true;
var email;
var lastname;

app.get('/contact', (req, res)=>{
  console.log(req.param('email'));
  var email = req.param('email');
  var lastname =req.param('lastname');
  client.query(`Select sfid from salesforce.Contact Where email='${email}'`, (err, data)=>{
    if(data !== undefined){
      if(data.rowCount == 0){ 
      
         console.log('Create record executed --');
         client.query(`Insert Into salesforce.Contact (Email) Values('${email}')`, 
         (err, data)=>{
            console.log('test');
            res.json(data.rows[0].id);
          })
        } 
      }else{
        res.json(data.rows[0].sfid);
      }
  
    })
  })
      
     

    //Update the modified contacts
    app.patch('/contacts', (req, res)=>{
      client.query(`Update  salesforce.Contact where Sfid = '${1}'`, [req.param('sfid')],(err,data)=>{
        res.json(data.rows[0]);
      })

    })

    //Dectivate in Salesforce the deteleted contacts??
    //I created a checkbox IsActive that will be assign to false
    app.patch('/contacts/:sfid',(req, res)=>{
      client.query(`Update salesforce.Contact  Set IsActive__c=${1}`,[false], (err, data)=>{
        res.json(data);
      })
    })



app.listen(port, ()=>{
    console.log('The app is listening on port http://localhost:'+ port);
})

