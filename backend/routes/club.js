const express = require('express')
const router = express.Router()
const Club = require('../models/clubSchema')

// Getting all
router.get('/', async (req, res) => {
    try {
        const clb = await Club.find()
        res.send(clb)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting one
router.get('/:name', async (req, res) => {
    try {
        const clb = await Club.find({ name: req.params.name })
        res.send(clb)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// router.get('/:day', async (req, res) => {
//     try{
//         const clb = await Club.find({day : req.params.day})
//         res.send(clb)
//     } catch (err){
//         res.status(500).json({message : err.message})
//     }
// })

// Creating one
router.post('/', async (req, res) => {
    const clb = new Club({
        name: req.body.name,
        password: req.body.password,
        meetings: req.body.meetings,
        events: req.body.events
    })

    try {
        const newClub = await clb.save()
        res.status(201).json(newClub)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Updating one
router.patch('/:id', getClub, async (req, res) => {
    if (req.body.name != null)
        res.club.name = req.body.name
    if (req.body.password != null)
        res.club.password = req.body.password
    if (req.body.meetings != null)
        res.club.meetings = req.body.meetings
    if (req.body.events != null)
        res.club.events = req.body.events

    try {
        const updatedClub = await res.club.save()
        res.json(updatedClub)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Deleting one
router.delete('/:id', getClub, async (req, res) => {
    try {
        await res.club.remove()
        res.json({ message: 'Successfully deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getClub(req, res, next) {
    let club
    try {
        club = await Club.findById(req.params.id)
        if (club == null) {
            return res.status(404).json({ message: 'Cannot find club' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.club = club
    next()
}

// router.put("/addRollNo", (req, res) => {
//     const club = req.body;
//     Club.findByIdAndUpdate(club._id, {
//         $push: {
//             roll_no: club.roll_no
//         }
//     }, {
//         new: true
//     }).then((data) => {
//         res.send(data)
//     })
// })

// router.put("/addMeeting", (req, res) => {
//     const club = req.body;
//     Club.findByIdAndUpdate(club._id, {
//         $push: {
//             meetings: club.meetings
//         }
//     }, {
//         new: true
//     }).then((data) => {
//         res.send(data)
//     })
// })

module.exports = router