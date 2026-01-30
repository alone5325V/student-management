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
    const data = fs.readFileSync('./students.json')

    const jsonData = JSON.parse(data)

    res.send(jsonData)
})

app.post('/students', (req, res) => {
    const tasks = JSON.parse(fs.readFileSync('students.json'))

    const newTask = {
        id: Date.now(),
        name: req.body.name,
        marks: req.body.marks
    }

    if(marks >= 40 && marks <= 100){
        newTask.status = "Pass"
    } else{
        newTask.status = "Fail"
    }

    tasks.push(newTask)
    fs.writeFileSync('students.json', JSON.stringify(tasks, null, 2))

    res.status(201).send("Student added successfully!")
})

app.get('/students/stats', (req, res) => {
    let marksCount
    const students = JSON.parse(fs.readFileSync('./students.joson'))
    for(let i=0; i<students.length; i++){
        marksCount += students[i].marks
    }

    const averageGrade = marksCount / (i + 1)
    res.status(200).send(`The average grade of students is ${averageGrade}`)
})

app.delete('/students/:id', (req, res) => {

})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))