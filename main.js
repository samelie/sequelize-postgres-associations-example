var path = require('path');

module.exports = function DB(options) {
	options = options || {};
    var admin = require('./db/admin')

    admin.sequelize.sync(options).then(function() {
        console.log("Synced the database!");
    }).catch(function(err) {
        console.log(err)
    });

    var api = require('./database_api');
    var API = new api(admin);

    return API;

};
