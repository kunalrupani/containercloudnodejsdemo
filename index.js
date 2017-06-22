const express = require('express');
const app = express();
const fs = require('fs');

const mysql = require('mysql');

const hbs = require('hbs');

//Global Variables
var PORT = process.env.PORT || 8089;

//Express middleware
//hbs.registerPartials(__dirname + '/views/partials'); // For reuseable hbs partials hearder/footer etc
app.set('view engine', 'hbs'); // For handle bars -looks at /views directory for .hbs files
app.use(express.static(__dirname + '/public')); //For rendering static html pages


//Generate server access log file and store in server.log
// app.use((req, res, next) => {
//   var now = new Date().toString();
//   var log = `${now}: ${req.method} ${req.url}`;
//   console.log(log);
//   fs.appendFile('server.log', log + '\n');
//   next();
// });


app.get('/', (req,res)=>{
    res.render('index.hbs', {
     pageTitle: 'Welcome!'
   });
   console.log('Fetched Root Page'); 
});


app.get('/employees/',(req,res)=>{

  console.log('REQ Query:', req.query.lastName);
  
  // MySQL Connection and SQL Query

  let connection = mysql.createConnection({
  host     : '140.86.14.205',
  user     : 'root',
  password : 'Oracle#2017',
  database : 'mydatabase'
  });
  
  connection.connect();
  
  let query = 'SELECT * FROM `mydatabase`.`employee` WHERE lastName = ' + '"' + req.query.lastName + '"';
  console.log(query);
  connection.query(query, function (error, results, fields) {
  console.log('Results:', results);
  if (error) {
    console.log('Error:' , error);
  }
  else
 {
  if(results.length >0)
  {
    console.log( 'ID:', results[0].id); 
    console.log('Name: ', results[0].firstName,results[0].lastName);
    console.log('Email: ',results[0].email);
    console.log('Phone:', results[0].phone );

    res.render('searchresults.hbs', {
      pageTitle: 'Employee Search Results!',
      id: results[0].id,
      firstName:results[0].firstName,
      lastName:results[0].lastName,
      email:results[0].email,
      phone: results[0].phone
    });
  }
  else {
    console.log('Employee:' + req.query.lastName +' Not found' , error);
    res.render('searchresults.hbs', {
      pageTitle: 'Employee Search Results!',
      id: "Not Found",
      firstName:"Not Found",
      lastName:"Not Found",
      email:"Not Found",
      phone: "Not Found"
    });

  }


 }

  }); 
  connection.end();


 

});



//**** For some reason this function when used - results in error in deploying on ACCS */
app.listen(PORT, ()=> {
    console.log('Server started on Port', PORT); 
});


