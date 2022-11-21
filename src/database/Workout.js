// In src/database/Workout.js
const DB = require("./db.json");
const { MongoClient } = require("mongodb");
const { saveToDatabase } = require("./utils");


const uri =
  "mongodb+srv://sdiricco:8vYaVvlDn2WjOl8K@cluster0.7ooa4te.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

client.connect().then(async ()=> {
  console.log('DB connected.')
});

const getAllWorkouts = async (filterParams) => {
  const limit = filterParams.limit ? parseInt(filterParams.limit) : 10;
  const page = filterParams.page ? parseInt(filterParams.page) : 1;

  try {
    const skipIndex = (page - 1) * limit
    const workouts = await client
      .db('sample_workout')
      .collection('workouts')
      .find()
      .skip(skipIndex)
      .limit(limit)
      .toArray();
    
    const total = await client
      .db('sample_workout')
      .collection('workouts')
      .countDocuments()

    const pages = Math.ceil(total/limit)

  return {
    workouts, 
    paging: {
      total,
      page,
      pages
    }
  }
  } catch (error) {
    throw{status: error?.status || 500, message: error?.message || error}
  }

};

const getOneWorkout = (workoutId) => {
  try {
    const workout = DB.workouts.find((workout) => workout.id === workoutId);
    if (!workout) {
      throw {
        status: 400,
        message: `Can't find workout with the id '${workoutId}'`,
      };
    }
    return workout;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const createNewWorkout = (newWorkout) => {
  try {
    const isAlreadyAdded =
      DB.workouts.findIndex((workout) => workout.name === newWorkout.name) > -1;
    if (isAlreadyAdded) {
      throw {
        status: 400,
        message: `Workout with the name '${newWorkout.name}' already exists`,
      };
    }
    DB.workouts.push(newWorkout);
    saveToDatabase(DB);
    return newWorkout;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const updateOneWorkout = (workoutId, changes) => {
  try {
    const indexForUpdate = DB.workouts.findIndex(
      (workout) => workout.id === workoutId
    );
    if (indexForUpdate === -1) {
      throw {
        status: 400,
        message: `Can't find workout with the id '${workoutId}'`,
      };
    }
    const updatedWorkout = {
      ...DB.workouts[indexForUpdate],
      ...changes,
      updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    };
    DB.workouts[indexForUpdate] = updatedWorkout;
    saveToDatabase(DB);
    return updatedWorkout;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const deleteOneWorkout = (workoutId) => {
  try {
    const indexForDeletion = DB.workouts.findIndex(
      (workout) => workout.id === workoutId
    );
    if (indexForDeletion === -1) {
      throw {
        status: 400,
        message: `Can't find workout with the id '${workoutId}'`,
      };
    }
    const deletedWorkout = DB.workouts[indexForDeletion];
    DB.workouts.splice(indexForDeletion, 1);
    saveToDatabase(DB);
    return deletedWorkout;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

module.exports = {
  getAllWorkouts,
  createNewWorkout,
  getOneWorkout,
  updateOneWorkout,
  deleteOneWorkout,
};
