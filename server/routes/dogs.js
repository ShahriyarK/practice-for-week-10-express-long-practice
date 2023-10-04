// ------------------------------  Boiler PLate Code ------------------------

const express = require('express');
const router = express.Router();

// ------------------------------  SERVER DATA ------------------------------

let nextDogId = 1;
function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const dogs = [
  {
    dogId: getNewDogId(),
    name: "Fluffy"
  },
  {
    dogId: getNewDogId(),
    name: "Digby"
  }
];

// ------------------------------  MIDDLEWARES ------------------------------

const validateDogInfo = (req, res, next) => {
  if (!req.body || !req.body.name) {
    const err = new Error("Dog must have a name");
    err.statusCode = 400;
    next(err);
  }
  next();
};
const validateDogId = (req, res, next) => {
  const { dogId } = req.params;
  const dog = dogs.find(dog => dog.dogId == dogId);
  if (!dog) {
    const err = new Error("Couldn't find dog with that dogId")
    err.statusCode = 404;
    throw err;
    // return next(err); // alternative to throwing it
  }
  next();
}


// ------------------------------  ROUTE HANDLERS ------------------------------

// GET /dogs
const getAllDogs = (req, res) => {
  res.json(dogs);
};

// GET /dogs/:dogId
const getDogById = (req, res) => {
  const { dogId } = req.params;
  const dog = dogs.find(dog => dog.dogId == dogId);
  res.json(dog);
}

// POST /dogs
const createDog = (req, res) => {
  const { name } = req.body;
  const newDog = {
    dogId: getNewDogId(),
    name
  };
  dogs.push(newDog);
  res.json(newDog);
};

// PUT /dogs/:dogId
const updateDog = (req, res) => {
  const { name } = req.body;
  const { dogId } = req.params;
  const dog = dogs.find(dog => dog.dogId == dogId);
  dog.name = name;
  res.json(dog);
};

// DELETE /dogs/:dogId
const deleteDog = (req, res) => {
  const { dogId } = req.params;
  const dogIdx = dogs.findIndex(dog => dog.dogId == dogId);
  dogs.splice(dogIdx, 1);
  res.json({ message: "success" });
};

// ------------------------------  ROUTER ------------------------------
// GET all dogs
router.get('/', getAllDogs);

router.use('/:dogId', validateDogId);

// When a request is sent to /dogs/:dogId, the validateDogId middleware will run
// but when a request is sent to /dogs, the validateDogId middleware wont run because
// the endpoint /dogs/:dogId doesnt match /dogs. On the other hand if we had defined
// the /dogs middleware in place of /dogs/:dogId middleware, that middleware would run
// even for requset to /dogs/:dogId because it matches that route i.e. /dog is a substring
// of /dogs/:dogId just for the sake of analogy

// GET a single dog by Id
router.get('/:dogId', getDogById);

// POST a new dog
router.post('/', validateDogInfo, createDog);

//PUT i.e. update a dog
router.put('/:dogId', validateDogInfo, updateDog)


//DELETE a dog based on id
router.delete('/:dogId', deleteDog)

// Your code here

module.exports = router;
