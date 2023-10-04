const express = require('express');
require('express-async-errors');
const app = express();
const dogRouter = require('./routes/dogs');
const foodRouter = require('./routes/dog-foods');

//Serving static files
app.use('/static', express.static('assets'));

//parsing request bodies that are json into js objects
app.use(express.json());

// Connect express router
app.use('/dogs', dogRouter);

app.use('/dogs/:dogId/foods', foodRouter);

app.use((req, res, next) => {
  console.log('URL: ', req.url);
  console.log('Req Method: ', req.method);
  // By using an event listener for the finish event, we ensure that the
  // callback passed to res.on only runs when a response is sent
  // in this way even if this logger middleware is defined before the route handlers
  // we can still see the response statusCode being logged
  res.on('finish', () => {
    console.log(res.statusCode);
  });
  // The response intially is 200 for get or whatever if we changed the status code
  // the logger middleware would show the right status code
  // but if we send a request second time, the status code is 304 showing that
  // nothing has been modified, the response is the same as before since it was
  // cached by the browser. You can see the original status code by deleting browser cache.
  next();
})

// For testing purposes, GET /

app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res, next) => {
  // You can see the error logged to the console without express-async-errors but the app crashes.
  throw new Error("Hello World!");
});


app.use((req, res) => {
  const err = new Error("The requested resource couldnt be found");
  err.statusCode = 404;
  throw err;
})

app.use((err, req, res, next) => {
  console.log(err);
  console.log('Message:', err.stack);
  res.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "production") res.json({message: err.message, statusCode: res.statusCode});
  else res.json({message: err.message, statusCode: res.statusCode, stack: err.stack});
})

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
