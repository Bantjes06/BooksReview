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


app.listen(port, () => {
    console.log(`Server is running on Port ${port}`);
})