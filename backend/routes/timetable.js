const express = require('express')
const router = express.Router()
const Timetable = require('../models/timetableSchema')

// Getting all
router.get('/', async (req, res) => {
    try{
        const classes = await Timetable.find()
        res.send(classes)
    } catch (err){
        res.status(500).json({message : err.message})
    }
})

// Getting one
router.get('/:branch/:section/:subsection', async (req, res) => {
    try{
        const classes = await Timetable.find({section : req.params.section, subsection : req.params.subsection})
        res.send(classes)
    } catch (err){
        res.status(500).json({message : err.message})
    }
})

router.get('/:day', async (req, res) => {
    try{
        const classes = await Timetable.find({day : req.params.day})
        res.send(classes)
    } catch (err){
        res.status(500).json({message : err.message})
    }
})

// Creating one
router.post('/', async (req, res) => {
    const cls = new Timetable({
        subject : req.body.subject,
        type : req.body.type,
        location : req.body.location,
        day : req.body.day,
        start_time : req.body.start_time,
        end_time : req.body.end_time,
        teacher : req.body.teacher,
        branch : req.body.branch,
        section : req.body.section,
        subsection : req.body.subsection
    })

    try{
        const newClass = await cls.save()
        res.status(201).json(newClass)
    } catch (err){
        res.status(400).json({message : err.message})
    }
})

// Updating one
router.patch('/:id', getTimetable, async (req, res) => {
    if(req.body.subject != null)
        res.timetable.subject = req.body.subject
    if(req.body.type != null)
        res.timetable.type = req.body.type
    if(req.body.location != null)
        res.timetable.location = req.body.location
    if(req.body.day != null)
        res.timetable.day = req.body.day
    if(req.body.start_time != null)
        res.timetable.start_time = req.body.start_time
    if(req.body.end_time != null)
        res.timetable.end_time = req.body.end_time
    if(req.body.teacher != null)
        res.timetable.teacher = req.body.teacher
    if(req.body.branch != null)
        res.timetable.branch = req.body.branch
    if(req.body.section != null)
        res.timetable.section = req.body.section
    if(req.body.subsection != null)
        res.timetable.subsection = req.body.subsection

    try{
        const updatedClass = await res.timetable.save()
        res.json(updatedClass)
    } catch(err){
        res.status(400).json({message : err.message})
    }
})

// Deleting one
router.delete('/:id', getTimetable, async (req, res) => {
    try{
        await res.timetable.remove()
        res.json({message : 'Successfully deleted'})
    } catch(err){
        res.status(500).json({message : err.message})
    }
})

async function getTimetable(req, res, next){
    let timetable
    try{
        timetable = await Timetable.findById(req.params.id)
        if(timetable == null){
            return res.status(404).json({message : 'Cannot find class'})
        }
    } catch(err){
        return res.status(500).json({message : err.message})
    }

    res.timetable = timetable
    next()
}

module.exports = router