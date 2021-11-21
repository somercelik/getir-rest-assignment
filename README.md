# Getir Assignment 1

This is the first assignment of Getir Node.JS interview. 
The deployed Heroku URL is: https://getir-rest-assignment.herokuapp.com/
The path for the test is /records,

Example request:
POST https://getir-rest-assignment.herokuapp.com/records
 ```json
 { 
     "startDate": "2016-01-26",  
     "endDate": "2018-02-02",  
     "minCount": 2700,  
     "maxCount": 3000  
 }
  ```
  If you would like to clone the repo to your localhost, execute the following commands line by line:
 ```sh
git clone https://github.com/somercelik/getir-rest-assignment.git
cd getir-rest-assignment
npm install
```
 
Before starting the server, you will need the .env file that includes the database connection details, the application need one line of environment variable, which has the key ```DB_CONN_URI```. It should look like following:
.env file -> 
```DB_CONN_URI = mongodb+srv://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX```
After this step, the environment should be ready to execute the following command and run the server:
```npm start```
