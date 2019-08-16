// mysql://bb0380b28b7a16:01e2429c@us-cdbr-iron-east-01.cleardb.net/heroku_f74e2220185cbc5?reconnect=true
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const port = process.env.PORT || 5000;

const app = express();

console.log("server started");

const db_config = {
  host: "us-cdbr-iron-east-01.cleardb.net",
  user: "bb0380b28b7a16",
  password: "01e2429c",
  database: "heroku_f74e2220185cbc5"
}

var con

app.use(cors());

app.get('/', (req, res) => {
    res.send('true')
})

function handleDisconnect() {
    con = mysql.createConnection(db_config);


con.connect(function(err){
  if(err){
    console.log('Error connecting to DB', err);
    setTimeout(handleDisconnect, 2000);
  }
  console.log('Connection established');
});

// grab user data
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
app.get('/user/single', (req, res) => {
  const { username } = req.query;
  con.query(`SELECT * FROM user WHERE user_username = '${username}';`, (err, result) => {
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

// /round/update?user=Razorz&save=test&round=2
app.get('/round/update', (req, res) => {
  const { user, save, round } = req.query;
  con.query(`UPDATE save SET save_round = ${round} WHERE save_name = '${save}' AND save_username = '${user}';`, (err, result) => {
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

app.get('/save', (req, res) => {
  con.query('SELECT * FROM save;', (err, result) => {
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

// /save/delete?user=Razorz&save=Game
app.get('/save/delete', (req, res) => {
  const { user, save } = req.query;
  con.query(`DELETE FROM player WHERE player_username = '${user}' AND player_savename = '${save}';`)
  con.query(`DELETE FROM country_current WHERE country_username = '${user}' AND country_savename = '${save}';`)
  con.query(`DELETE FROM country_past WHERE country_username = '${user}' AND country_savename = '${save}';`)
  con.query(`DELETE FROM save WHERE save_username = '${user}' AND save_name = '${save}';`, (err, result) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.json({
        data : result
      })
    }
  });
})

// add data to save games
app.get('/save/add', (req, res) => {
  const { save_name, save_count, save_username, round } = req.query;
  con.query(`INSERT INTO save(save_name, save_count, save_username, save_round) VALUES('${save_name}', ${save_count}, '${save_username}', '${round}');`, (err, result) => {
    if(err) {
      return res.send(err)
    }
    else {
      return res.send('Success!')
    }
  })
})

app.get('/save/find', (req, res) => {
  const { name, username } = req.query;
  con.query(`SELECT * FROM save WHERE save_name = '${name}' AND save_username = '${username}';`, (err, result) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.json({
        data : result
      })
    }
  });
})

app.get('/players', (req, res) => {
  con.query('SELECT * FROM player;', (err, result) => {
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

app.get('/players/add', (req, res) => {
  const { user, save, country, count, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10 } = req.query;
  con.query(`INSERT INTO player(player_username, player_savename, player_country, player_count, player_1, player_2, player_3, player_4, player_5, player_6, player_7, player_8, player_9, player_10) VALUES('${user}', '${save}', '${country}', ${count}, '${p1}', '${p2}', '${p3}', '${p4}', '${p5}', '${p6}', '${p7}', '${p8}', '${p9}', '${p10}');`, (err, result) => {
    if(err) {
      return res.send(err)
    }
    else {
      return res.send('Success!')
    }
  })
})

app.get('/save/games', (req, res) => {
  const { username } = req.query;
  con.query(`SELECT * FROM save WHERE save_username = '${username}';`, (err, result) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.json({
        data : result
      })
    }
  });
})

app.get('/save/selectgame', (req, res) => {
  const { username, name } = req.query;
  con.query(`SELECT * FROM save WHERE save_username='${username}' && save_name='${name}';`, (err, result) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.json({
        data : result
      })
    }
  });
})

app.get('/current', (req, res) => {
  const { user } = req.query;
  con.query(`SELECT * FROM country_current WHERE country_username = '${user}';`, (err, result) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.json({
        data : result
      })
    }
  });
})

app.get('/current/grab', (req, res) => {
  const { user, name } = req.query;
  con.query(`SELECT * FROM country_current WHERE country_username = '${user}' AND country_savename = '${name}';`, (err, result) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.json({
        data : result
      })
    }
  });
})

app.get('/current/add', (req, res) => {
  const { user, save, name, rank, gold, pp} = req.query;
  con.query(`INSERT INTO country_current(country_username, country_savename, country_name, country_rank, country_gold, country_power_points) VALUES ('${user}', '${save}', '${name}', ${rank}, ${gold}, ${pp});`, (err, result) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.json({
        data : result
      })
    }
  });
})

app.get('/past', (req, res) => {
  con.query('SELECT * FROM country_past;', (err, result) => {
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

app.get('/past/find', (req, res) => {
  const { user } = req.query;
  con.query(`SELECT * FROM country_past WHERE country_username = '${user}';`, (err, result) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.json({
        data : (result + 'true')
      })
    }
  });
})

app.get('/past/add', (req, res) => {
  const { user, save, name, rank, gold, pp} = req.query;
  con.query(`INSERT INTO country_past(country_username, country_savename, country_name, country_rank, country_gold, country_power_points) VALUES ('${user}', '${save}', '${name}', ${rank}, ${gold}, ${pp});`, (err, result) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.json({
        data : (result + 'true')
      })
    }
  });
})

// http://localhost:5000/current/update?user=Razorz&save=test&country=Germany&gold=21&rank=3
app.get('/current/update', (req, res) => {
  const { user, save, country, gold, rank, pp} = req.query;
  con.query(`UPDATE country_current SET country_gold = ${gold}, country_rank = ${rank}, country_power_points = ${pp} WHERE country_username = '${user}' AND country_savename = '${save}' AND country_name = '${country}';`, (err, result) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.json({
        data : result
      })
    }
  });
})

// http://localhost:5000/past/update?user=Razorz&save=test&country=Germany&gold=21&rank=3
app.get('/past/update', (req, res) => {
  const { user, save, country, gold, rank, pp} = req.query;
  con.query(`UPDATE country_past SET country_gold = ${gold}, country_rank = ${rank}, country_power_points = ${pp} WHERE country_username = '${user}' AND country_savename = '${save}' AND country_name = '${country}';`, (err, result) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.json({
        data : result
      })
    }
  });
})

con.on('error', function(err) {
  console.log('db error', err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
    handleDisconnect();                         // lost due to either server restart, or a
  } else {                                      // connnection idle timeout (the wait_timeout
    throw err;                                  // server variable configures this)
  }
});
}

app.listen(port, () => {
  console.log(port);
});

handleDisconnect();