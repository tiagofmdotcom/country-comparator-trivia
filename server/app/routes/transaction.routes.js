const multer = require('multer');
const upload = multer({ dest: 'tmp/csv/' });

module.exports = app => {
  const portfolio = require("../controllers/portfolio.controller.js");

  var router = require("express").Router();

  // Create a new Portfolio
  router.post("/", portfolio.create);

  // Retrieve all portfolio
  router.get("/", portfolio.findAll);

  // Retrieve all published portfolio
  router.get("/published", portfolio.findAllPublished);

  // Retrieve a single Portfolio with id
  router.get("/:id", portfolio.findOne);

  // Update a Portfolio with id
  router.put("/:id", portfolio.update);

  // Delete a Portfolio with id
  router.delete("/:id", portfolio.delete);

  // Delete all portfolio
  router.delete("/", portfolio.deleteAll);

  app.use('/api/portfolio', router);
};
