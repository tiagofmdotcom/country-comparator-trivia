'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Transactions', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },

            startDate: {
                type: Sequelize.DATE
            },

            completeDate: {
                type: Sequelize.DATE
            },

            description: {
                type: Sequelize.TEXT
            },

            amount: {
                type: Sequelize.DECIMAL(20,20)
            },

            fee: {
                type: Sequelize.DECIMAL(20,20)
            },

            state: {
                type: Sequelize.STRING
            },

            balance: {
                type: Sequelize.DECIMAL(20,20)
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Transactions');
    }
};
