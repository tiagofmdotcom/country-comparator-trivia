'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // * portofolios <> * coins
    await queryInterface.createTable('Portfolio_Coins', {
      portfolioId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: 'portfolios', key: 'id' }
      },
      coinId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: 'cryptocurrencies', key: 'id' }
      },
      createdAt: {
          allowNull: false,
          type: Sequelize.DATE
      },
      updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
      }
    },
    {
      underscore: true,
    });

    queryInterface.addColumn(
      'transactions', // name of Source model
      'coinId', // name of the key we're adding 
      {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cryptocurrencies', // name of Target model
          key: 'id', // key in Target model that we're referencing~
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    )
    /*.then(() => {
      // Order hasMany Product
      return queryInterface.addColumn(
        'Products', // name of Target model
        'OrderId', // name of the key we're adding
        {
          type: Sequelize.UUID,
          references: {
            model: 'Orders', // name of Source model
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      );
    });*/
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Portfolio_Coins');
    await queryInterface.removeColumn(
      'transactions', // name of Source model
      'coinId' // key we want to remove
    )
  }
};
