const { json } = require('body-parser');
const express = require('express');
const fs = require('fs')
const app = express();
app.use(express.json())

const PORT = 3000;

const secreatHeader = (req, res, next) => {
    const password = req.headers['x-auth']

    if(password === 'teacher-pass'){
        next()
    } else{
        res.status(403).send("Try again!!")
    }
}

app.get('/students', (req, res) => {
    if(!fs.existsSync('./students.json')){
        return res.json([])
    }

    const data = fs.readFileSync('./students.json')

    const jsonData = JSON.parse(data)

    res.send(jsonData)
})

app.post('/students', (req, res) => {
    let tasks = JSON.parse(fs.readFileSync('students.json'))

    const newTask = {
        id: Date.now(),
        name: req.body.name,
        marks: req.body.marks,
        status: ""
    }

    if(newTask.marks >= 40 && newTask.marks <= 100){
        newTask.status = "Pass"
    } else{
        newTask.status = "Fail"
    }

    tasks.push(newTask)
    fs.writeFileSync('students.json', JSON.stringify(tasks, null, 2))

    res.status(201).send("Student added successfully!")
})

app.get('/students/stats', (req, res) => {
    let marksCount = 0
    const students = JSON.parse(fs.readFileSync('./students.json'))
    for(let i=0; i<students.length; i++){
        marksCount += students[i].marks
    }

    const averageGrade = marksCount / students.length
    res.status(200).send(`The average grade of students is ${averageGrade}`)
})

app.delete('/students/:id',secreatHeader, (req, res) => {
    const idToDelete = req.params.id

    const rawData = fs.readFileSync('./students.json')
    const jsonData = JSON.parse(rawData)

    const length = jsonData.length
    jsonData = jsonData.filter(item => item.id != idToDelete)

    if(jsonData.length === length){
        return res.status(404).send("Student not found")
    }

    fs.writeFileSync('./students.json', json.stringify(jsonData, null, 2))

    res.send(500).send("Error updating file.")
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))