const express = require('express')
const router = express.Router()
const Teacher = require('../models/teacherSchema')

// Getting all
router.get('/', async (req, res) => {
    try{
        const teach = await Teacher.find()
        res.send(teach)
    } catch (err){
        res.status(500).json({message : err.message})
    }
})

// Getting one
router.get('/:id', getTeacher, async (req, res) => {
    try{
        const teach = await Teacher.findById(req.params.id)
        res.send(teach)
    } catch (err){
        res.status(500).json({message : err.message})
    }
})

// Creating one
router.post('/', async (req, res) => {
    const teach = new Teacher({
        name : req.body.name,
        password : req.body.password
    })

    try{
        const newTeacher = await teach.save()
        res.status(201).json(newTeacher)
    } catch (err){
        res.status(400).json({message : err.message})
    }
})

// Updating one
router.patch('/:id', getTeacher, async (req, res) => {
    if(req.body.name != null)
        res.teacher.name = req.body.name
    if(req.body.password != null)
        res.teacher.password = req.body.password

    try{
        const updatedTeacher = await res.teacher.save()
        res.json(updatedTeacher)
    } catch(err){
        res.status(400).json({message : err.message})
    }
})

// Deleting one
router.delete('/:id', getTeacher, async (req, res) => {
    try{
        await res.teacher.remove()
        res.json({message : 'Successfully deleted'})
    } catch(err){
        res.status(500).json({message : err.message})
    }
})

async function getTeacher(req, res, next){
    let teacher
    try{
        teacher = await Teacher.findById(req.params.id)
        if(teacher == null){
            return res.status(404).json({message : 'Cannot find teacher'})
        }
    } catch(err){
        return res.status(500).json({message : err.message})
    }

    res.teacher = teacher
    next()
}

module.exports = router