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
const { networkInterfaces } = require('os');


const connectionStr= process.env.DATABASE_URL || 
'postgres://wdevvykplmbaeb:1a4c4fc6b12cc7c6e15e35ea1b2942bfb58804756bc897b67ed05ba9ef684507@ec2-54-147-54-83.compute-1.amazonaws.com:5432/d4bpsl1kd0k5a8';

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


//Pass the email as a param, if the email is in Salesforce, it will return the sfid
  //if not, a new record will be created with that email % name is required
app.get('/contact', (req, res)=>{
  console.log(req.param('email'));
  var email = req.param('email');
  var lastname= req.param('lastname');
  client.query(`Select sfid from salesforce.Contact Where email='${email}'`, (err, data)=>{
    if(data !== undefined){
      console.log(data.rowCount);
      if(data.rowCount == 0){ 
         console.log('Create record executed --');
         client.query(`Insert Into salesforce.Contact (lastname,email) Values('${lastname}','${email}')`, (err,newData)=>{
           if(newData.rowCount== 0){
             res.send('The contact cannot be created, please check the data');
           }else{
         client.query(`Select sfid,id from salesforce.contact where email='${email}'`,(err, data)=>{
          res.json(data);
        }, 
           
         );
         }
        });
      }else{
        res.json(data.rows[0].sfid);
      }//add sf id
    }
    })
  })
  
      
     

    //Update the modified contacts
    //Is a way to update record automatically, without adding each field? !!
    app.patch('/contacts', (req, res)=>{
      var sfid = req.param('sfid');
      
      client.query(`Update  salesforce.Contact where Sfid = '${sfid}'`,(err,data)=>{
        
        res.json('Update completed');
      })

    })

    //Dectivate in Salesforce the deteleted contacts
    //Based on the salesforce id, the contact in Salesforce is deactivated
    app.patch('/contacts/deactivate',(req, res)=>{
      var sfid= req.param('sfid');
      console.log(sfid + '-- deactivate contact ');
      client.query(`Update salesforce.Contact Set isActive__c=false where sfid='${sfid}'`);
      
          client.query(`Select sfid, isActive__c from salesforce.contact where sfid='${sfid}'`, (err,data)=>{
            
            res.send(data.fields[1].name+ ':' +data.rows[0].isactive__c );
          })
      })
 
      // Update contract fields 
      //Need to pass all the fields that can be maped
      app.put('/contract', (req, res)=>{
        let accName= req.body.name;
        let accSfid= '';
        let ctrTerm= 6;
          client.query(`Select sfid from salesforce.account where name='${accName}'`, (errs, accData)=>{
            accSfid= accData.rows[0].sfid;
          client.query(`update salesforce.contract set contractterm='${ctrTerm}' where accountid= '${accSfid}'`, (err, ctrData)=>{
            
            if(ctrData.rowCount!==0){
              res.send('Contract updated! ')
            }else{
              res.send('Something went wrong');
            }
          });
          });
        });
      

        // Create a new Contract record based on the information in the body
        app.post('/contract/create', (req, res)=>{
          var accName = req.body.name;
          let date = req.body.date;
          let ctrTerm = req.body.contractTerm;
          let accId = '';
          client.query(`Select sfid from salesforce.account where name='${accName}'`,(err,accData)=>{
            accId = accData.rows[0].sfid;
            console.log(accId);
           
            client.query(`Insert into salesforce.contract (accountid, startdate, contractterm) Values ('${accId}', '${date}', '${ctrTerm}')`,
            (err, ctrData)=>{
              res.json(ctrData);
              })
            })

          })
    
    



app.listen(port, ()=>{
    console.log('The app is listening on port http://localhost:'+ port);
})

