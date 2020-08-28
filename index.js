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
  var email = req.param('email');
  var lastname= req.param('lastname');
  client.query(`Select sfid,id from salesforce.Contact Where email='${email}'`, (err, data)=>{
    if(data !== undefined){
      if(data.rowCount == 0){ 
         client.query(`Insert Into salesforce.Contact (lastname,email) Values('${lastname}','${email}')`, (err,newData)=>{
           if(newData.rowCount== 0){
             res.send('The contact could not be created, please check the data');
           }else{
         client.query(`Select sfid,id from salesforce.contact where email='${email}'`,(err, data)=>{
          res.json(data.rows[0].id);
        },
         );
         }
        });
      }else{
        res.json(data.rows[0]);
      }
    }
    })
  })
  
      
     

    //Update the modified contacts
 
    app.put('/contact', (req, res)=>{
      console.log('Update contact running');
      var contactId= req.param('id');
      console.log(contactId);
        //Fields 
        let name = req.body.name;
        let lastname= req.body.lastname;
        let email = req.body.email;
        let mobile = req.body.mobilephone;
        
        console.log(name +' '+ lastname) ;
            client.query(`Update salesforce.Contact Set name='${name}',lastname='${lastname}',
                          email ='${email}', mobilephone='${mobile}'
                          Where id='${contactId}'`, (err,conData)=>{
                            console.log('test');
                if(conData.rowCount !==0){
                  res.json(conData);
                }else{
                  res.send('Something went wrong');
                }
              
              });
            });
      
        
    

    //Dectivate in Salesforce the deteleted contacts
    //Based on the salesforce id, the contact in Salesforce is deactivated
    app.patch('/contact/deactivate',(req, res)=>{
      var id= req.param('id');
      console.log(id + '-- deactivate contact ');
      client.query(`Update salesforce.Contact Set isActive__c=false where id='${id}'`, (err, data)=>{
        if(data.rowCount !==0){
        res.json(data);
        }else{
          res.send('Something went wrong');
        }
      });
      
          });
    
 
      // Update contract fields based on the account name
      app.put('/contract', (req, res)=>{
        let accName= req.param('name');
        let accSfid= '';
        let ctrTerm=  req.body.contractterm;
        let startDate = req.body.startdate;
        let status= req.body.status;
        console.log(accName);
        console.log(accSfid +' '+ startDate+' '+ status);
          client.query(`Select sfid from salesforce.account where name='${accName}'`, (errs, accData)=>{
            accSfid= accData.rows[0].sfid;

          client.query(`Update salesforce.contract set contractterm='${ctrTerm}', startdate='${startDate}',
           status='${status}'
           where accountid= '${accSfid}'`, (err, ctrData)=>{
              res.json(ctrData);
            
            })
          });
          });
      
      

        // Create a new Contract record based on the information in the body
        app.post('/contract/create', (req, res)=>{
          var accName = req.body.name;
          let date = req.body.date;
          let ctrTerm = req.body.contractterm;
          let accId = '';
          client.query(`Select sfid from salesforce.account where name='${accName}'`,(err,accData)=>{
            accId = accData.rows[0].sfid;
            console.log(accId);
           console.log(accName,date,ctrTerm);
            client.query(`Insert into salesforce.contract (accountid, startdate, contractterm) 
                          Values ('${accId}', '${date}', '${ctrTerm}')`,
            (err, ctrData)=>{
              res.json(ctrData);
              })
            })

          })

          // endpoing for update account details
        app.port('/account' ,(req, res)=>{
          accName=  req.param('name');
          accShipState= req.body.shippingstate;
          accShipPostal = req.body.postalcode;
          accShipStreet = req.body.shippingstreet;
          accShipContry = req.body.shippingcontry;
          accShipCity= req.body.shippingcity;
          client.query(`Update salesforce.account Set shippingstate='${accShipState}', shippingcountry='${accShipContry}',
          shippingcity='${accShipCity}', shippingstreet='${accShipStreet}', shippingpostalcode ='${accShipPostal}'`, (err, data)=>{
            if(data.rowCount !== 0){
              res.json(data);
            }else{
              res.send('Something went wrong');
            }
          })


        })

    
    



app.listen(port, ()=>{
    console.log('The app is listening on port http://localhost:'+ port);
})

