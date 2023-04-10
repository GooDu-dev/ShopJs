const sql = require('mysql2')
const dbConnection = sql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'shop_crud_node'
}).promise()

module.exports = dbConnection