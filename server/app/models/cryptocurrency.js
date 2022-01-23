'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cryptocurrency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cryptocurrency.hasMany(models.Transaction, {
        as: 'transactions',
        foreignKey: 'coinId',
        target: 'id'
      });

      Cryptocurrency.belongsToMany(models.Portfolio, {
        as: 'portfolio',
        foreignKey: 'coinId',
        target: 'id',
        through: 'Portfolio_Coins'
      });
    }
  };
  Cryptocurrency.init({
    name: DataTypes.STRING,
    symbol: DataTypes.STRING,
    balance: DataTypes.DECIMAL(20,20),
    invested: {
      type: new DataTypes.VIRTUAL(DataTypes.DECIMAL(20,20), ['transactions.amount']),
      get: function() {
        return this.transactions.reduce((total, curr) => total + Number.parseFloat(curr.get('amount')), 0) //console.log(this.transactions)
        //sequelize.fn('SUM', sequelize.col('transactions.amount'))()
        //this.transactions.sum.get('createdAt') > Date.now() - (7 * 24 * 60 * 60 * 1000)
      }
    }
  }, {
    sequelize,
    modelName: 'Cryptocurrency',
  });
  return Cryptocurrency;
};