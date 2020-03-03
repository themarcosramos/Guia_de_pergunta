const Sequelize = require('sequelize');

    const connection =  new Sequelize(
        'guia_de_perguntas',
        'root',
        '',
        {
            dialect: 'mariadb',
        },
    );

module.exports = connection;