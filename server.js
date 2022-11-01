const express = require("express");
const app = express();
const cors = require("cors");
const logger = require('./src/services/logger.service.ts');
const axios = require("axios");
const passport = require('passport');

// load our environment variables
(function () {
  const dotenv = require('dotenv');
  const result = dotenv.config({
    path: 'config.env'
  });
  if (result.error) {
    logger.error("Warning: Starting server WITHOUT .env file")
  }
})()

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
// app.use(require("./routes/record"));

// connect to our DB
const dbo = require("./src/db/dbConnection");

// start the application
const port = process.env.PORT || 4000;
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) logger.error(err);
  });
  logger.log(`TTRM Auth server is running on port: ${port}`);
});

/* 
  Routes
*/
app.get("/oauth/redirect", (req, res) => {
  axios({
    method: "POST",
    url: `${GITHUB_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`,
    headers: {
      Accept: "application/json",
    },
  }).then((response) => {
    res.redirect(
      `http://localhost:3000?access_token=${response.data.access_token}`
    );
  });
});
