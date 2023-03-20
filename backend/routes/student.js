const express = require('express')
const router = express.Router()
const Student = require('../models/studentSchema')

// Getting all
router.get('/', async (req, res) => {
    try{
        const stud = await Student.find()
        res.send(stud)
    } catch (err){
        res.status(500).json({message : err.message})
    }
})

// Getting one
router.get('/:rollno', async (req, res) => {
    try{
        const stud = await Student.find({roll_no : req.params.rollno})
        res.send(stud)
    } catch (err){
        res.status(500).json({message : err.message})
    }
})

// Creating one
router.post('/', async (req, res) => {
    const stud = new Student({
        name : req.body.name,
        password : req.body.password,
        branch : req.body.branch,
        subsection : req.body.subsection,
        roll_no : req.body.roll_no,
        domain_id : req.body.domain_id
    })

    try{
        const newStudent = await stud.save()
        res.status(201).json(newStudent)
    } catch (err){
        res.status(400).json({message : err.message})
    }
})

// Updating one
router.patch('/:id', getStudent, async (req, res) => {
    if(req.body.name != null)
        res.student.name = req.body.name
    if(req.body.password != null)
        res.student.password = req.body.password
    if(req.body.branch != null)
        res.student.branch = req.body.branch
    if(req.body.subsection != null)
        res.student.subsection = req.body.subsection
    if(req.body.roll_no != null)
        res.student.roll_no = req.body.roll_no
    if(req.body.domain_id != null)
        res.student.domain_id = req.body.domain_id

    try{
        const updatedStudent = await res.student.save()
        res.json(updatedStudent)
    } catch(err){
        res.status(400).json({message : err.message})
    }
})

// Deleting one
router.delete('/:id', getStudent, async (req, res) => {
    try{
        await res.student.remove()
        res.json({message : 'Successfully deleted'})
    } catch(err){
        res.status(500).json({message : err.message})
    }
})

async function getStudent(req, res, next){
    let student
    try{
        student = await Student.findById(req.params.id)
        if(student == null){
            return res.status(404).json({message : 'Cannot find student'})
        }
    } catch(err){
        return res.status(500).json({message : err.message})
    }

    res.student = student
    next()
}

module.exports = router