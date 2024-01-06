Same in MongoDb style : 

const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Replace the connection string with your MongoDB connection string
const mongoURI = "mongodb+srv://gchaitanya1419:Chaitanya14@cluster0.bpwbtja.mongodb.net/";
const dbName = "yourDatabaseName"; // Replace with your actual database name

mongoose.connect(mongoURI + dbName, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

const bookSchema = new mongoose.Schema({
    title: String,
    authorId: String, // Assuming authorId is a string, modify as needed
    rating: Number,
});

const Book = mongoose.model("Book", bookSchema);

app.use(express.json());

app.get("/books/", async (request, response) => {
    try {
        const booksArray = await Book.find();
        response.send(booksArray);
    } catch (error) {
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});

app.post("/books/", async (request, response) => {
    try {
        const bookDetails = request.body;
        const { title, authorId, rating } = bookDetails;
        const newBook = new Book({ title, authorId, rating });
        await newBook.save();
        response.send({ bookId: newBook._id });
    } catch (error) {
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});

app.put("/books/:bookId/", async (request, response) => {
    try {
        const { bookId } = request.params;
        const bookDetails = request.body;
        const { title, authorId, rating } = bookDetails;
        await Book.findByIdAndUpdate(bookId, { title, authorId, rating });
        response.send("Book Updated Successfully");
    } catch (error) {
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});

app.delete("/books/:bookId/", async (request, response) => {
    try {
        const { bookId } = request.params;
        await Book.findByIdAndDelete(bookId);
        response.send("Book Deleted Successfully");
    } catch (error) {
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
