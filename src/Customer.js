const express = require('express'); 
const sqlite3 = require('sqlite3'); 
const app = express();

const db = new sqlite3.Database('./Database/Customer.sqlite');
 
app.use(express.json());

db.run(`CREATE TABLE IF NOT EXISTS books ( 
    id INTEGER PRIMARY KEY, 
    title TEXT, 
    author TEXT

)`);

app.get('/Customers', (req, res) => {
    db.all('SELECT * FROM Customers', (err, rows) => {
    if (err) {
        res.status(500).send(err);
    } else {
        res.json(rows); 
    }
    });   
});
    
app.get('/Customers/: id', (req, res) => {
    db.get('SELECT * FROM Customers WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send('Book not found');
            } else {
                res.json(row);
            }
    }
 });
});
    
app.post('/Customers', (req, res) => {
    const book = req.body;
    db.run('INSERT INTO Customers (title, author) VALUES (?, ?)', Customer.title, Customer.author, function(err) {
    if (err) {
        res.status(500).send(err);
    } else {
        Customer.id = this.lastID;
        res.send(book); 
    }
    });   
});

app.put('/Customers/:id', (req, res) => {
    const Customer = req.body;
    db.run('UPDATE Customers SET title = ?, author = ? WHERE id = ?', Customer.title, Customer.author, req.params.id, function(err) {
    if (err) {
        res.status(500).send(err);
    } else {
        res.send(Customer); 
    }
    });   
});

app.delete('/Customers/:id', (req, res) => {
    db.run('DELETE FROM Customers WHERE id = ?', req.params.id, function(err) {
    if (err) {
        res.status(500).send(err);
    } else {
        res.send({}); 
    }
    });   
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));