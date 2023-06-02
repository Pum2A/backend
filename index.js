

const express = require('express');

const app = express();
app.use(express.static(__dirname + 'public'));

const cors = require('cors');

app.use(cors());

const { pool } = require('./util/database')


const ports = process.env.PORT || 3000; 

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const http = require('http');



app.listen(ports, () => console.log (`Listenining on port number: ${ports} `));






app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
  next();
});


  app.get('/api/house-info/:id', (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM houses WHERE id = ${id}`;
    pool.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      } else if (results.length === 0) {
        res.status(404).json({ message: `House with id ${id} not found` });
      } else {
        res.json(results[0]);
      }
    });
  });


  
  app.post("/api/reservations/:id", (req, res) => {
    let details = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      check_in: req.body.check_in,
      check_out: req.body.check_out,
      guests: req.body.guests,
      house_id: req.params.id,
    };
  
    let sql = "INSERT INTO reservations (name, email, phone, guests, house_id) VALUES (?, ?, ?, ?, ?)";
let values = [details.name, details.email, details.phone, details.guests, details.house_id];

pool.query(sql, [details.name, details.email, details.phone, details.guests, details.house_id], (error, result) => {
    if (error) {
        console.log("Query error:", error);
        res.send({ status: false, message: "Reservation creation failed" });
    } else {
        console.log("Query result:", result);
        res.send({ status: true, message: "Reservation created successfully" });
    }
});
  });
  
  //info z tabeli houses z mysql
  
  app.get('/api/houses', function(req, res) {
    pool.query('SELECT * FROM houses', function(error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
  });
  
  
  // post do contact tabeli
  
  
  app.post("/api/contact", (req, res) => {
    let details = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      about: req.body.about,
    };
  
    let sql = "INSERT INTO contact (name, email, phone, about) VALUES (?, ?, ?, ?)";
let values = [details.name, details.email, details.phone, details.about];

pool.query(sql, [details.name, details.email, details.phone, details.about ], (error, result) => {
    if (error) {
        console.log("Query error:", error);
        res.send({ status: false, message: "Reservation creation failed" });
    } else {
        console.log("Query result:", result);
        res.send({ status: true, message: "Reservation created successfully" });
    }
});
  });

  
  //info z tabeli contact z mysql
  
  app.get('/api/contact', function(req, res) {
    pool.query('SELECT * FROM contact', function(error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
  });

