const lodash = require('lodash');
const router = require('express').Router();
let Exercise = require('../models/exercise.model');

router.route('/').get((req, res) => {
    Exercise.find()
        .then(exercises => res.json(exercises))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const payload = req.body;
    const username = payload.username;
    const description = payload.description;
    const duration = Number(payload.duration);
    const date = Date.parse(payload.date);    

    const newExercise = new Exercise({
        username,
        description,
        duration,
        date
    });

    newExercise.save()
        .then(() => res.json('Exercise added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get(async(req,res) => {
    try{
        const exercise = await Exercise.findById(req.params.id);
        
        return res.json(exercise)
    } catch (e) {
        res.status(400).json('Error: ' + e);
    }
});

router.route('/:id').delete(async(req, res) => {
    try{
        await Exercise.findByIdAndDelete(req.params.id);
        
        return res.json('Exercise deleted.')
    } catch (e) {
        res.status(400).json('Error ' + e);
    }
});

router.route('/update/:id').post(async(req, res) => {
    try{
        let exercise = await Exercise.findById(req.params.id);
        const {username, description, duration, date} = req.body;

        exercise.username = username;
        exercise.description = description;
        exercise.duration = Number(duration);
        exercise.date = Date.parse(date);
        
        await exercise.save();

        return res.json('Exercise updated!');
    } catch (e) {
        res.status(400).json('Error ' + e);
    }
});

module.exports = router;