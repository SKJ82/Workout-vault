const Workout = require('../models/workoutModel')
const mongoose = require('mongoose')

//Get all workouts
const getAllWorkouts = async (req, res) => {
    const user_id = req.user._id
    const all_workouts = await Workout.find({ user_id }).sort({createdAt: -1});
    res.status(200).json(all_workouts)
}

//Get a single workout
const getSingleWorkout = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({error : "No such Workout"})

    const single_workout = await Workout.findById(id);
    
    if(!single_workout)
        return res.status(404).json({error : "No such Workout"})

    res.status(200).json(single_workout)
}

//Add a new workout
const addWorkout = async (req, res) => {
    const {title, reps, load} = req.body

    let emptyFields = []

    if(!title)
        emptyFields.push('title')

    if(!load)
        emptyFields.push('load')

    if(!reps)
        emptyFields.push('reps')

    if(emptyFields.length > 0)
        return res.status(400).json({error : 'Please fill in all the fields', emptyFields})

    //add doc to database
    try{
        const user_id = req.user._id
        const workout = await Workout.create({title, reps, load, user_id})
        res.status(200).json(workout)
    }

    catch(error){
        res.status(400).json({error : error.message})
    }
}

//Update a workout
const updateWorkout = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({error : "No such workout"})

    const workout = await Workout.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if(!workout)
        return res.status(404).json({error : "No such workout"})

    return res.status(200).json(workout)
}

//Delete a workout
const deleteWorkout = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error : "No such Workout"})
    }

    const workout = await Workout.findOneAndDelete({_id: id})
    
    if(!workout)
        return res.status(404).json({error : "No such Workout"})

    return res.status(200).json(workout)
}

module.exports = {
    addWorkout,
    getAllWorkouts,
    getSingleWorkout,
    deleteWorkout,
    updateWorkout
}