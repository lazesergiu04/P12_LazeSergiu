var express = require('express');
var bodyParser = require('body-parser');

let port = process.env.PORT || 5000;
var path = require('path');

const app = express();

app.use(express.static('www'));
app.use(express.static(path.join('www', 'build')));

app.use(bodyParser.json());

const { Client } = require('pg');

const connectionStr= process.env.DATABASE_URL || 'postgres://expfftnffbdkvh:8afc4a8c06c78c97f53b2e25b8a0581bd6c8fdd7356a0fd06ebc2b3b91912ad8@ec2-18-210-214-86.compute-1.amazonaws.com:5432/d4v5pjn3g2jgag';


const client = new Client({
  connectionString:connectionStr,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();
var contactEmails =[];
var contactIds =[];
var contactSfIds =[];
var contacts= [];

app.get('/contacts', (req, res)=>{
  client.query(`Select id, sfid, email from salesforce.Contact`, (err, data)=>{
    res.json(data);
  })
})

//Get the Contact records ( email, id, sfId)

app.get('/contacts/:email', (req, res)=>{
  client.query(`Select sfid from salesforce.Contacts Where Email= ${1}`,[req.body.email], (err, data)=>{
    if(data.rowCount == 0){
      app.put(`/`,(req, res)=>{
        client.query(`Insert Into salesforce.Contact (FirstName, LastName, Email) Values($1,$2, $3, $4)`,
        [req.body.firstName.trim(), req.body.lastName.trim(), req.body.email.trim()],(err, data)=>{
          res.json(data.rows[0].sfid);

        })
      } )


    }else{
      res.json(data.rows[0].sfid);
    }
  })
    });



    //Update the modified contacts
    app.patch('/contacts/:sfid', (req, res)=>{
      client.query(`Update  salesforce.Contact where Sfid = ${1}`, [req.body.sfid],(err,data)=>{
        res.json(data.rows[0]);
      })

    })

    //Dectivate in Salesforce the deteleted contacts
    //I created a checkbox IsActive that will be assign to false
    app.patch('/contacts/:sfid',(req, res)=>{
      client.query(`Update salesforce.Contact  Set IsActive__c=${1}`,[false], (err, data)=>{
        res.json(data);
      })
    })



app.listen(port, ()=>{
    console.log('The app is listening on port http://localhost:'+ port);
})

