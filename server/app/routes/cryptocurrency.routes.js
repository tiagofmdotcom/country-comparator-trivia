const multer = require('multer');
const upload = multer({ dest: 'tmp/csv/' });

module.exports = app => {
  const cryptocurrency = require("../controllers/cryptocurrency.controller.js");

  var router = require("express").Router();

  // Create a new Cryptocurrency
  router.post("/", cryptocurrency.create);

  // Import from csv report
  router.post('/import-csv', upload.single('file'), cryptocurrency.importCsv);

  // Retrieve all cryptocurrency
  router.get("/", cryptocurrency.findAll);

  // Retrieve all published cryptocurrency
  router.get("/published", cryptocurrency.findAllPublished);

  // Retrieve a single Cryptocurrency with id
  router.get("/:id", cryptocurrency.findOne);

  // Update a Cryptocurrency with id
  router.put("/:id", cryptocurrency.update);

  // Delete a Cryptocurrency with id
  router.delete("/:id", cryptocurrency.delete);

  // Delete all cryptocurrency
  router.delete("/", cryptocurrency.deleteAll);

  app.use('/api/cryptocurrency', router);
};
