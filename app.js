const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 6000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Radwaradwa",
  database: "gymchain",
});

//connect to db
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("mysql connected");
});

// create database
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE gymchain";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("Database Created");
  });
});
app.get("/creatlocation", (req, res) => {
  let sql =
    "CREATE TABLE gymlocation (location_id int auto_increment, name varchar(20), address varchar(200), telephone varchar(20) , primary key (location_id))";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("gymlocation table created");
  });
});

app.post("/insert", (req, res) => {
  let post = req.body;
  let sql = "INSERT INTO gymlocation SET ?";
  post.map((location) => {
    db.query(sql, location, (err) => {
      if (err) {
        res.send(err.message);
        throw err;
      }
    });
  });
  res.send("gym locations added");
});

app.get("/getlocation", (req, res) => {
  let sql = "SELECT * FROM gymlocation";
  db.query(sql, (err, results) => {
    if (err) {
      res.send(err.message);
      throw err;
    }
    console.log(results);
    res.send(results);
  });
});

app.post("/uplocation", (req, res) => {
  let id = req.query.id;
  var newname = req.body;
  let sql = `UPDATE gymlocation SET name = '${newname.name}' WHERE location_id = ${id}`;
  console.log(newname, id);

  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("location name updated");
  });
});
app.get("/addmembertable", (req, res) => {
  let sql =
    "CREATE TABLE member (member_id int auto_increment, lastname varchar(255), firstname varchar(255), address varchar(255), dateofbirth DATE NOT NULL, gender varchar(255), primary key (member_id))";
  db.query(sql, (err) => {
    if (err) {
      res.send(err.message);
      throw err;
    }
  });

  res.send("member table created");
});

app.post("/insetmembersDataa", (req, res) => {
  let addmember = req.body;
  let sql = "INSERT INTO member SET ?";
  addmember.map((member) => {
    db.query(sql, member, (err) => {
      if (err) {
        throw err;
      }
    });
  });
  res.send("member added");
});

app.get("/getmember", (req, res) => {
  let sql = "SELECT * FROM member";
  db.query(sql, (err, results) => {
    if (err) {
      res.send(err.message);
      throw err;
    }
    console.log(results);
    res.send(results);
  });
});

// Create coach table
app.get("/createcoach", (req, res) => {
  let sql =
    "CREATE TABLE coach (coach_id int auto_increment, lastname varchar(255), firstname varchar(255), dateofbirth DATE NOT NULL, gender varchar(255), primary key (coach_id))";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
  });
  console.log("coach table created");
  res.end();
});

app.post("/insertCoach", (req, res) => {
  let newcoach = req.body;
  let sql = "INSERT INTO coach SET ?";
  newcoach.map((coach) => {
    db.query(sql, coach, (err) => {
      if (err) {
        throw err;
      }
    });
  });
  res.send("coach added");
});

app.get("/getcoach", (req, res) => {
  let sql = "SELECT * FROM member";
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results);
    res.send(results);
  });
});

// Create session table
app.get("/createsession", (req, res) => {
  let sql =
    "CREATE TABLE session (session_id int auto_increment, sport varchar(255), schudle DATE NOT NULL, location_id int NOT NULL, coach_id int NOT NULL, primary key (session_id), FOREIGN KEY (coach_id) REFERENCES coach(coach_id),  FOREIGN KEY (location_id) REFERENCES gymlocation(location_id))";
  db.query(sql, (err) => {
    if (err) {
      console.log(err.message);
      throw err;
    }
  });
  console.log("session table created");
  res.end();
});

app.post("/insertsession", (req, res) => {
  let newsession = req.body;
  let sql = "INSERT INTO session SET ?";
  newsession.map((session) => {
    db.query(sql, session, (err) => {
      if (err) {
        throw err;
      }
    });
  });
  console.log("session added");
  res.end();
});
app.get("/getsession", (req, res) => {
  let sql = "SELECT * FROM session";
  db.query(sql, (err, results) => {
    if (err) {
      res.send(err.message);
      throw err;
    }
    console.log(results);
    res.send(results);
  });
});

app.get("/membersession", (req, res) => {
  let sql =
    "CREATE TABLE member_session (member_id int NOT NULL, session_id int NOT NULL, date DATE NOT NULL, FOREIGN KEY (member_id) REFERENCES member(member_id), FOREIGN KEY (session_id) REFERENCES session(session_id))";
  db.query(sql, (err) => {
    if (err) {
      console.log(err.message);
      throw err;
    }
  });
  console.log("member session table created");
  res.end();
});

app.post("/insertmembersession/:session_id/:member_id", (req, res) => {
  let session_id = req.params.session_id;
  let member_id = req.params.member_id;
  let date = new Date();
  let sql1 = ` SELECT * FROM member_session WHERE session_id = ${session_id} AND member_id = ${member_id}`;
  db.query(sql1, (err, results) => {
    if (err) {
      throw err;
    }
    exists(results.length > 0 ? true : false);
  });
  function exists(exist) {
    if (exist) {
      console.log("session already booked");
      return;
    }
    let sql = `SELECT * FROM member_session WHERE session_id = ${session_id}`;
    db.query(sql, (err, results) => {
      if (err) {
        throw err;
      }
      setOutPut(results.length);
    });
    function setOutPut(rows) {
      if (rows < 20) {
        let sql2 = "INSERT INTO member_session SET ?";
        let object = {
          member_id: member_id,
          session_id: session_id,
          date: date,
        };
        db.query(sql2, object, (err) => {
          if (err) {
            throw err;
          }
        });
        console.log("session booked successfully");
      } else {
        console.log("session is fully booked");
      }
    }
  }
  res.end();
});
app.listen(port, () => {
  console.log("server started on port" + port);
});
