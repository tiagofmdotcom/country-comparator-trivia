'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Portfolio extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Portfolio.belongsToMany(models.Cryptocurrency, {
                as: 'coins',
                foreignKey: 'portfolioId',
                target: 'id',
                through: 'Portfolio_Coins'
            });
        }
    }
    Portfolio.init(
        {
            name: DataTypes.STRING,
            defaultCurrency: DataTypes.DECIMAL
        },
        {
            sequelize,
            modelName: 'Portfolio',
            Portfolio_Coins: false
        }
    );
    return Portfolio;
};
