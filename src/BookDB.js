const express = require('express');
const Sequelize = require('sequelize');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

// Create SQLite database and initialize tables
const db = new sqlite3.Database('./Database/library.sqlite');
db.run(`
  CREATE TABLE IF NOT EXISTS borrowers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS borrowing_dates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    borrower_id INTEGER,
    borrow_date TEXT,
    return_date TEXT,
    FOREIGN KEY (borrower_id) REFERENCES borrowers(id)
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT
  )
`);
db.close((err) => {
  if (err) {
    console.error('Error closing the database:', err.message);
  } else {
    console.log('Database created and tables initialized successfully.');
  }
});

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: './Database/BookDB.sqlite'
});

const Book = sequelize.define('book', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Borrower = sequelize.define('borrower', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const BorrowingDate = sequelize.define('borrowing_date', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  borrow_date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  return_date: {
    type: Sequelize.DATE
  }
});

Book.belongsTo(Borrower);
Book.belongsTo(BorrowingDate);

// Sync the models with the database
sequelize.sync();

// API routes

// Create a new book
app.post('/books', async (req, res) => {
  try {
    const { title, borrowerName, borrowDate, returnDate } = req.body;
    const borrower = await Borrower.create({ name: borrowerName });
    const borrowingDate = await BorrowingDate.create({
      borrow_date: borrowDate,
      return_date: returnDate,
      borrowerId: borrower.id
    });
    const book = await Book.create({ title, borrowingDateId: borrowingDate.id });
    res.json(book);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add route to create a new borrower
app.post('/borrower', async (req, res) => {
    try {
      const { name } = req.body;
      const borrower = await Borrower.create({ name });
      res.json(borrower);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });  

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        {
          model: Borrower,
          attributes: ['name']
        },
        {
          model: BorrowingDate,
          attributes: ['borrow_date', 'return_date']
        }
      ]
    });
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put('/books/:id', async (req, res) => {
    try {
      const bookId = req.params.id;
      const { title } = req.body;
  
      // Find the book by its ID
      const book = await Book.findByPk(bookId);
  
      if (!book) {
        return res.status(404).send('Book not found');
      }
  
      // Update the book's title
      await book.update({ title });
  
      return res.send(book);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });
  
  
  app.delete('/books/:id', async (req, res) => {
    try {
      const bookId = req.params.id;
  
      // Find Book
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).send('Book not found');
      }
  
      // Delete associated BorrowingDate
      await BorrowingDate.destroy({ where: { bookId } });
  
      // Delete Book
      await book.destroy();
  
      res.send('Book deleted successfully');
    } catch (error) {
      res.status(500).send(error.message);
    }
  });  

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
