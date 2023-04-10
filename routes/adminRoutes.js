const express = require('express')
const db = require('../database/database')
const { authRole } = require('../auth/authPermission')
const { isLoggedIn, isNotLoggedIn } = require('../auth/authLogin')

const route = express()

route.get('/', isLoggedIn, authRole(), (req, res) => {

})

module.exports = route