require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();

const db = new sqlite3.Database("./Database/BookDB.sqlite");

app.use(express.json());


db.run(`CREATE TABLE IF NOT EXISTS book (book_id INTEGER PRIMARY KEY,
				book_name TEXT )`);

db.run(`CREATE TABLE IF NOT EXISTS user (user_id INTEGER PRIMARY KEY,
  user_name TEXT, borrowdate DATE, returndate DATE)`);



db.run(`CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY,
book_id INTEGER NOT NULL,user_id INTEGER NOT NULL ,
FOREIGN KEY(book_id) REFERENCES book(book_id) , 
FOREIGN KEY(user_id) REFERENCES user(user_id))`);



// ดึงข้อมูล
// ดูข้อมูลทั้งหมด
// Book
app.get("/book", (req, res) => {
  db.all("SELECT * FROM book ",(err, row) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!row) {
        res.status(404).send("Book not found");
      } else {
        res.json(row);
      }
    }
  });
});

// ดูข้อมูลด้วย id
app.get("/book/:id", (req, res) => {
  db.get("SELECT * FROM book WHERE book_id = ? ", req.params.id, (err, row) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!row) {
        res.status(404).send("Book not found");
      } else {
        res.json(row);
      }
    }
  });
});


//ส่วนนี้บอสทำต่อให้จนเสร็จละ คือการเพิ่มข้อมูล
app.post("/book", (req, res) => {
  const books = req.body;
  db.run(
    "INSERT INTO book (book_name) VALUES (?)",
    books.book_name,
    (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        
        books.id = this.lastID;
        res.send(books);
        res.status(200);
      }
    }
  );
});



//ส่วนแก้ไข
app.put("/book/:id", (req, res) => {
  console.log(req.params.id);
  const books = req.body;
  db.run(
    "UPDATE book SET book_name = ? WHERE book_id = ? ",
    books.book_name,
    req.params.id,
    (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(books);
      }
    }
  );
});


//ลบไปทำเอาเอง
app.delete("/book/:id", (req, res) => {
  db.run("DELETE FROM book WHERE book_id = ?", req.params.id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({});
    }
  });
});



// user
app.get("/user", (req, res) => {
  db.all("SELECT * FROM user ",(err, row) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!row) {
        res.status(404).send("user not found");
      } else {
        res.json(row);
      }
    }
  });
});

// ดูข้อมูลด้วย id
app.get("/user/:id", (req, res) => {
  db.get("SELECT * FROM user WHERE user_id = ? ", req.params.id, (err, row) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!row) {
        res.status(404).send("user not found");
      } else {
        res.json(row);
      }
    }
  });
});



//เพิ่มข้อมูล
app.post("/user", (req, res) => {
  const users = req.body;
  db.run(
    "INSERT INTO user (user_name, borrowdate, returndate) VALUES (?, ?, ?)",
    users.user_name,
    users.borrowdate,
    users.returndate,
    (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        
        users.id = this.lastID;
        res.send(users);
        res.status(200);
      }
    }
  );
});


//ส่วนแก้ไข
app.put("/user/:id", (req, res) => {
  console.log(req.params.id);
  const users = req.body;
  db.run(
    "UPDATE user SET user_name = ?, borrowdate = ?, returndate = ?  WHERE user_id = ? ",
    users.user_name,
    users.borrowdate,
    users.returndate,
    req.params.id,
    (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(users);
      }
    }
  );
});


//ลบไปทำเอาเอง
app.delete("/user/:id", (req, res) => {
  db.run("DELETE FROM user WHERE user_id = ?", req.params.id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({});
    }
  });
});



// data
app.get("/data", (req, res) => {
  db.all("SELECT * FROM data ",(err, row) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!row) {
        res.status(404).send("Data not found");
      } else {
        res.json(row);
      }
    }
  });
});

// ดูข้อมูลด้วย id
app.get("/data/:id", (req, res) => {
  
  db.get("SELECT * FROM data WHERE id = ? ", req.params.id, (err, row) => {
    
    if (err) {
      res.status(500).send(err);
    } else {
      if (!row) {
        res.status(404).send("Data not found");
      } else {
        console.log(row)
        res.json(row);
      }
    }
  });
});



//เพิ่มข้อมูล
app.post("/data", (req, res) => {
  const datas = req.body;
  db.run(
    "INSERT INTO data (book_id , user_id) VALUES (?, ?)",
    datas.book_id,
    datas.user_id,
    (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        
        datas.id = this.lastID;
        res.send(datas);
        res.status(200);
      }
    }
  );
});


//ส่วนแก้ไข
app.put("/data/:id", (req, res) => {
  console.log(req.params.id);
  const datas = req.body;
  db.run(
    "UPDATE data SET book_id = ?, user_id = ?  WHERE id = ? ",
    datas.book_id,
    datas.use_id,
    req.params.id,
    (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(datas);
      }
    }
  );
});


//ลบไปทำเอาเอง
app.delete("/data/:id", (req, res) => {
  db.run("DELETE FROM data WHERE id = ?", req.params.id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({});
    }
  });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));