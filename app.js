const { json } = require('body-parser');
const express = require('express');
const fs = require('fs')
const app = express();
app.use(express.json())

const PORT = 3000;

app.get('/books', (req, res) => {

    const genreFilter = req.query.genre
    const rawData = fs.readFileSync('./books.json')
    const jsonData = JSON.parse(rawData)
    const booksOfCategory = []

    if (genreFilter) {
        const filtered = jsonData.filter(b => b.genre.toLowerCase() === genreFilter.toLowerCase())
        booksOfCategory.push(filtered)

        return res.status(200).json(booksOfCategory).send(typeof(filtered))
    }

    res.status(200).json(jsonData)
})

app.put('/books/:id/borrow', (req, res) => {
    const id = req.params.id

    const rawData = fs.readFileSync('./books.json')
    const jsonData = JSON.parse(rawData)
    let found = false;

    const book = jsonData.find(b => b.id == id)
    let available = book.isAvailable

    if (available) {

        if (book) {
            book.isAvailable = false
            found = true
        }

        if (!found) {
            return res.status(404).send("Book not found")
        }

        fs.writeFileSync('./books.json', JSON.stringify(jsonData, null, 2))

        res.send("Task completed")
    }
    else {
        res.send("Book is already borrowed")
    }
})

app.put('/books/:id/return', (req, res) => {
    const id = req.params.id

    const rawData = fs.readFileSync('./books.json')
    const jsonData = JSON.parse(rawData)
    jsonData.find(b => b.id == jsonData.id).isAvailable = true

    fs.writeFileSync('./books.json', JSON.stringify(jsonData, null, 2))

    res.status(200).send("Book returned seccessfully!")
})

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))