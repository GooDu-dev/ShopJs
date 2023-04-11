const { body } = require('express-validator')
const db = require('../database/database')

function isLoggedIn(req, res, next){
    if(!req.session.loggedIn){
        res.redirect('/login')
    }
    next()
}
function isNotLoggedIn(req, res, next){
    if(req.session.loggedIn){
        return res.redirect('/')
    }
    next()
}

const registerValidation = [
    body('user_name', 'Username is Empty!').trim().not().isEmpty(),
    body('user_email', "Email is Invalid").isEmail().custom(value => {
        return db.execute('SELECT * FROM users WHERE email=?', [value]).then(([rows]) => {
            if(rows.length === 0){
                return true
            }
            return Promise.reject('Email is already used!')
        })
    }),
    body('user_password', 'Password must contain at least 6 characters!').trim().not().isEmpty().isLength({min:6})
]

const loginValidation = [
    body('user_email', "Email is Invalid").isEmail().custom(value => {
        return db.execute('SELECT * FROM users WHERE email=?', [value]).then(([rows]) => {
            if(rows.length === 1){
                return true
            }
            return Promise.reject('Email is Invalid')
        })
    }),
    body('user_password', 'Password is Empty').trim().not().isEmpty()
]

module.exports = {
    isLoggedIn,
    isNotLoggedIn,
    registerValidation,
    loginValidation
}