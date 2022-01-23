const db = require("../models");
const Cryptocurrency = db.Cryptocurrency;
const Transaction = db.Transaction;
const Op = db.Sequelize.Op;

// Create and Save a new Cryptocurrency
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Cryptocurrency
  const cryptocurrency = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  };

  // Save Cryptocurrency in the database
  Cryptocurrency.create(cryptocurrency)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Cryptocurrency."
      });
    });
};

exports.importCsv = (req, res) => {
  const csv = require('fast-csv');
  const fs = require('fs');
  
  const fileRows = [];
  csv.parseFile(req.file.path)
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      console.log(fileRows) //contains array of arrays. Each inner array represents row of the csv file, with each element of it a column
      fs.unlinkSync(req.file.path);   // remove temp file
      //process "fileRows" and respond
      
      const headers =     [
        "Type",
        "Product",
        "Started Date",
        "Completed Date",
        "Description",
        "Amount",
        "Fee",
        "Currency",
        "State",
        "Balance"
      ];

      // Create a transaction
      const transaction = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
      };
      Transaction.create({balance: 0.00069430})

     /* Transaction.bulkCreate(fileRows.map((item, index) => {
        if(index > 0) return 0
        
      }), {validate: false})*/
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Cryptocurrency."
        });
      });
      //res.send(fileRows)
    })

}

// Retrieve all Cryptocurrencies from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Cryptocurrency.findAll({ where: condition, include: [
    {model: Transaction, as: 'transactions'}
] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cryptocurrencies."
      });
    });
};

// Find a single Cryptocurrency with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Cryptocurrency.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Cryptocurrency with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Cryptocurrency with id=" + id
      });
    });
};

// Update a Cryptocurrency by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Cryptocurrency.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Cryptocurrency was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Cryptocurrency with id=${id}. Maybe Cryptocurrency was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Cryptocurrency with id=" + id
      });
    });
};

// Delete a Cryptocurrency with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Cryptocurrency.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Cryptocurrency was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Cryptocurrency with id=${id}. Maybe Cryptocurrency was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Cryptocurrency with id=" + id
      });
    });
};

// Delete all Cryptocurrencies from the database.
exports.deleteAll = (req, res) => {
  Cryptocurrency.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Cryptocurrencies were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all cryptocurrencies."
      });
    });
};

// find all published Cryptocurrency
exports.findAllPublished = (req, res) => {
  Cryptocurrency.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cryptocurrencies."
      });
    });
};
