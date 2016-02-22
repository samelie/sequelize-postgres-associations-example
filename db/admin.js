var configForAdmin = {
	"username": process.env.AWS_RDS_USER,
    "password": process.env.AWS_RDS_PASSWORD,
    "database": process.env.AWS_RDS_DB,
    "host": process.env.AWS_RDS_HOST,
    "dialect": "postgres"
};

module.exports = require('../models/index')(configForAdmin);