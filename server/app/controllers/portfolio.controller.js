const db = require("../models");
const Portfolio = db.Portfolio;
const Cryptocurrency = db.Cryptocurrency;
const Op = db.Sequelize.Op;

// Create and Save a new Portfolio
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Portfolio
  const portfolio = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  };

  // Save Portfolio in the database
  Portfolio.create(portfolio)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Portfolio."
      });
    });
};


// Retrieve all Portfolios from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Portfolio.findAll({ where: condition, include: [
    {model: Cryptocurrency, as: 'coins'}
] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving portfolios."
      });
    });
};

// Find a single Portfolio with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Portfolio.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Portfolio with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Portfolio with id=" + id
      });
    });
};

// Update a Portfolio by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Portfolio.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Portfolio was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Portfolio with id=${id}. Maybe Portfolio was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Portfolio with id=" + id
      });
    });
};

// Delete a Portfolio with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Portfolio.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Portfolio was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Portfolio with id=${id}. Maybe Portfolio was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Portfolio with id=" + id
      });
    });
};

// Delete all Portfolios from the database.
exports.deleteAll = (req, res) => {
  Portfolio.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Portfolios were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all portfolios."
      });
    });
};

// find all published Portfolio
exports.findAllPublished = (req, res) => {
  Portfolio.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving portfolios."
      });
    });
};
