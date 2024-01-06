const express = require("express");
const sqlite = require('sqlite')
const {open} = sqlite
const sqlite3  = require('sqlite3')
const path = require('path')
const app = express();

let db = null
const connectDatabase =  async () => {
    
    try {
        db =  await open({
        filename : dbPath,
        driver : 
    }) 


    } catch(error) {
        console.log(error)
    }


}

connectDatabase()


app.get("/books/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      book
    ORDER BY
      book_id;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});


app.post("/books/", async (request, response) => {
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
  } = bookDetails;
  const addBookQuery = `
    INSERT INTO
      book (title,author_id,rating)
    VALUES
      (
        '${title}',
         ${authorId},
         ${rating},
      );`;

  const dbResponse = await db.run(addBookQuery);
  const bookId = dbResponse.lastID;
  response.send({ bookId: bookId });
});



app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const bookDetails = request.body;
  const {
    title,
    authorId,
    rating,
    
  } = bookDetails;
  const updateBookQuery = `
    UPDATE
      book
    SET
      title='${title}',
      author_id=${authorId},
      rating=${rating},
      '
    WHERE
      book_id = ${bookId};`;
  await db.run(updateBookQuery);
  response.send("Book Updated Successfully");
});


app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const deleteBookQuery = `
    DELETE FROM
      book
    WHERE
      book_id = ${bookId};`;
  await db.run(deleteBookQuery);
  response.send("Book Deleted Successfully");
});




app.listen(3000, () => console.log("app is running on 3000 port"));
