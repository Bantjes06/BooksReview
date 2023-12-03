import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import ejs from "ejs";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "0616610022",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let books = [];

app.get("/", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM book_details ORDER BY id ASC");
      books = result.rows;
      console.log(books);
  
      res.render("index.ejs", {
        books: books
      });
    } catch (err) {
      console.log(err);
    }
  });

  app.get("/latest", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM book_details ORDER BY id DESC");
      books = result.rows;
      console.log(books);
  
      res.render("index.ejs", {
        books: books
      });
    } catch (err) {
      console.log(err);
    }
  });

  app.get("/rating", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM book_details ORDER BY rating DESC");
      books = result.rows;
      console.log(books);
  
      res.render("index.ejs", {
        books: books
      });
    } catch (err) {
      console.log(err);
    }
  });

app.get("/new", async (req, res) => {
  res.render("new.ejs");
});

app.post("/submit", async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const review = req.body.review;
  const isbn = req.body.isbn;
  const rating = req.body.rating;
  const readDate = req.body.readDate;
  const link = req.body.link;

  const result = await db.query(
    "INSERT INTO book_details (title, description, review, isbn, rating, read_date, link) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
    [title, description, review, isbn, rating, readDate, link]
  );

  res.redirect("/");
});

app.post('/read-review', async (req, res) => {
  try {
      const bookId = req.body.bookId;
      const result = await db.query('SELECT * FROM book_details WHERE id = $1', [bookId]);
      const bookDetails = result.rows[0];
      res.render('read_review.ejs', { book: bookDetails });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

app.post('/edit', async (req, res) => {
  try {
      const id = req.body.editBookId;
      const result = await db.query('SELECT * FROM book_details WHERE id = $1', [id]);
      const bookDetails = result.rows[0];
      res.render('edit_review.ejs', { book: bookDetails });
  } catch (err){
      console.error(err);
      res.status(500).send('Server error');
  }
});

app.post("/update", async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const review = req.body.review;
  const isbn = req.body.isbn;
  const link = req.body.link;
  const id = req.body.updateBookId;

  try{
    const result = await db.query(
      "UPDATE book_details SET title = $1, description = $2, review = $3, isbn = $4, link = $5 WHERE id = $6",
      [title, description, review, isbn, link, id]
    );
    res.redirect("/");
  } catch(err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteBookId;
  try {
    await db.query("DELETE FROM book_details WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
    console.log(`Server is running on Port ${port}`);
})