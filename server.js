// mysql://bb0380b28b7a16:01e2429c@us-cdbr-iron-east-01.cleardb.net/heroku_f74e2220185cbc5?reconnect=true
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.static(__dirname + '/dist/'));

console.log("server started");

const con = mysql.createConnection({
  host: "us-cdbr-iron-east-01.cleardb.net",
  user: "bb0380b28b7a16",
  password: "01e2429c",
  database: "heroku_f74e2220185cbc5"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to DB', err);
    return err;
  }
  console.log('Connection established');
});

app.get('/', (req, res) => {
  res.send('hi');
});

app.get('/user', (req, res) => {
  con.query('SELECT * FROM user;', (err, result) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.json({
        data : result
      })
    }
  });
});

app.listen(port, () => {
  console.log(port);
});