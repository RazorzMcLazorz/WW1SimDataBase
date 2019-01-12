// mysql://beab6996bfdada:194b0321@us-cdbr-iron-east-01.cleardb.net/heroku_99e17af419b7336?reconnect=true
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const port = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.static(__dirname + '/dist/'));

console.log("server started");

const con = mysql.createConnection({
  host: "us-cdbr-iron-east-01.cleardb.net",
  user: "beab6996bfdada",
  password: "194b0321",
  database: "heroku_99e17af419b7336"
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