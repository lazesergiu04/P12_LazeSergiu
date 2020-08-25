# P12_LazeSergiu
Project 12 for OC from Salesforce path

# Hello
#Here are the instruction on how to deploy and run the app: 
 1. Please make sure you have a GitHub account
 2. Go to this link https://github.com/lazesergiu04/P12_LazeSergiu, click on Code and clone the repository in your local device
 3. Please go to this link https://dashboard.heroku.com/ and create an account
 4. Once the account is validated and running, please create a new app with the name of your chosing and region based on your location, and click on Create App.
 5. You will be able to see the new app on your dashboard, please select it.
 6. When the app is open, please go to resources and in the search box, write " Connect" and select "Heroku Connect"
 7. Choose the plan you wnat to use, the app will run with the free version with no problems, and confirm the connection.
 8.Now you have an app with Heroku Connect ! Well Done! (but we are not done yet) 
 9. Please go back to Resources tab and in the search box write "post" and select "Heroku Postgres"
 10. You can choose the free version , select a name and please confirm the add-on.
 11. Please go back to the Resources tab and select Heroku Connect, and go to the Mappings.
 12. Select Create Mapping and you will be able to login in your Salesforce org and Allow access for Heroku.
 13. The mapping will connect Salesforce Object with the Postgres database, and you will able to perform actions on that object, outside of Salesforce.
 14. Once the mapping is done your Heroku app is ready to use. 
 ## Code side
  1.  Actually before we go into the code, please go to your dashbord on Heroku and select your app
  2. In the app go to Resources tab and select Heroku Postgres, and go to the Settings tab
  3. Click on View Credentials and copy the link from URI, we will use it soon.
  4.Now we need to open the app in your IDE(VSCode, ATOM etc) 
  5. Go to the index.js file and on line 19, where we define the port, replace the existing link with your link from Heroku
  6. Please make sure the link is in a format of a string, like " your link here". 
  7. Save the changes and commit it. 
  7. Now we need to open a terminal and we will deploy this app to your Heroku app
  8. In the terminal run  "heroku login" and new window will open, just confirm your credentials and login.
  9. Also in the terminal run " heroku git:remote -a <your app name>" and the app will be automatically deployed to heroku.
  10. You will be able to open the app from you Heroku dashboard by clicking on Open App.
  
If you need more help, here is a link with a Youtube video that might help you to deploy the app: https://www.youtube.com/watch?v=MxfxiR8TVNU&t=103s

## REST API Endpoints
 --Get all the Contact data--
 ~ '/' -(GET) the root endpoint that has as response all the Contact data from the database
 
 --Get id/sfid based on the email--
 ~ '/contact' -(GET) this endpoint takes two parameter, the email of the contact and the last name. If the email exists in a database, the call will return the id and the Salesforce id of that record
                if the email does not exists in the database, a new record will be created with that email and last name, and will return the id. 
                 Once a record is created, you can run the same call, with the same parameter and the call will return the Salesforce id of the new contact, takes about one minute to update the database.
 
 --Update a Contact--
~ "/contact " -(PUT)  this call takes as parameter the id of the contact record , and in the body of the call you need to specifi the name, lastname, email and mobile telephone number, 
                if everything goes as expected, the call will retunrn the data in JSON format, if not a message will be displayed. 
                
 -- Deactivate a Contact in Salesforce --
 ~ "/contact/deactivate" -(PATCH) takes the id of the contact as parameter and it will set isActive field to false, that is a checkbox in Salesforce. 
 
 -- Create a new Contract --
 ~ "/contract/create - (POST) the call will create a new contract based on the information provided in the body. The required fields are account name, date and contract term.
                        based on the account name, the account id will be added to the record. 
                        
  -- Update Contract-- 
  ~ "/contract" -(PUT) takes the account's name as a parameter and will update the contract with the fields: contract term, status, start date
  
 
 
