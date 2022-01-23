'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Cryptocurrency, {
        as: 'coin',
        foreignKey: 'coinId',
        target: 'id'
      });
    }
  };
  Transaction.init({
    startDate: DataTypes.DATE,
    completeDate: DataTypes.DATE,
    description: DataTypes.TEXT,
    amount: DataTypes.DECIMAL(20,20),
    fee: DataTypes.DECIMAL(20,20),
    balance: DataTypes.DECIMAL(20,20),
    state: DataTypes.ENUM('completed', 'pending'),
  }, {
    sequelize,
    modelName: 'Transaction',
    timestamps: false,
  });
  return Transaction;
};