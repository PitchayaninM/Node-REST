const express = require('express');
const Sequelize = require('sequelize');
const app = express();

app.use(express.json());

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

// Define associations
Book.belongsTo(Borrower);
Book.belongsTo(BorrowingDate);

sequelize.sync();

// API routes

app.post('/books', async (req, res) => {
  try {
    const { title, borrowerName, borrowDate, returnDate } = req.body;

    // Create borrower
    const borrower = await Borrower.create({ name: borrowerName });

    // Create borrowing date
    const borrowingDate = await BorrowingDate.create({
      borrow_date: borrowDate,
      return_date: returnDate,
      borrowerId: borrower.id
    });

    // Create book
    const book = await Book.create({ title, borrowingDateId: borrowingDate.id, borrowerId: borrower.id });

    res.json(book);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/borrower', async (req, res) => {
  try {
    const { name } = req.body;
    const borrower = await Borrower.create({ name });
    res.json(borrower);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

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
      ],
      attributes: ['title']
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

    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).send('Book not found');
    }

    await book.update({ title });

    return res.send(book);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).send('Book not found');
    }

    await BorrowingDate.destroy({ where: { id: book.borrowingDateId } });
    await book.destroy();

    res.send('Book deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/all_data', async (req, res) => {
  try {
    const allData = await Book.findAll({
      include: [
        {
          model: Borrower,
          attributes: ['name']
        },
        {
          model: BorrowingDate,
          attributes: ['borrow_date', 'return_date']
        }
      ],
      attributes: ['title']
    });
    res.json(allData);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
