const express = require('express')
const db = require('../database/database')
const { authRole } = require('../auth/authPermission')
const { isLoggedIn, isNotLoggedIn } = require('../auth/authLogin')
const { roles } = require('../database/role')

const route = express()

route.get('/', isLoggedIn, (req, res, next) => {
    authRole(req, roles.Admin).then(() => {next()}).catch(err=>{throw err})
}, (req, res) => {
    res.render('adminPage')
})

module.exports = route