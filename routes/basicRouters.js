const express = require('express')
const { validationResult } = require('express-validator')
const db = require('../database/database')
const { isLoggedIn, isNotLoggedIn, registerValidation, loginValidation } = require('../auth/authLogin')
const bcrypt = require('bcrypt')
const { roles } = require('../database/role')
const { isSessionCreated } = require('../auth/setting')
const cookie = require('cookie-session')

const router = express.Router()

router.get('/', (req, res, next) => {
    console.log(req.session)
    isSessionCreated(req, res).then(() => {next()}).catch(err => {
        next()
    })
}, (req, res) => {
    console.log(req.session)
    user = req.session.userID ? db.execute('SELECT * FROM users WHERE id=?', [req.session.userID]) : null
    return db.execute('SELECT * FROM products').then(([rows]) => {
        return res.render('index', {
            products : rows,
            user : req.session.user
        })
    })
})

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login/login', {
        user : req.session.user
    })
})

router.post('/requestLogin', isNotLoggedIn, loginValidation, (req, res) => {
    const validation_result = validationResult(req)
    const { user_email, user_password } = req.body
    if(validation_result.isEmpty()){
        db.execute('SELECT * FROM users WHERE email=?', [user_email]).then(([rows]) => {
            bcrypt.compare(user_password, rows[0].password).then(compare_result => {
                if(compare_result){
                    req.session.loggedIn = true
                    req.session.userID = rows[0].id
                    res.redirect('/')
                }
                else{
                    res.render('login/login', {
                        errors : ['Invalid Password'],
                        user : req.session.user
                    })
                }
            }).catch(err=>{console.log(err)})
        }).catch(err=>{console.log(err)})
    }
    else{
        let allError = validation_result.errors.map(err => err.msg)
        res.render('login/login', {
            errors : allError,
            user : req.session.user
        })
    }
})

router.get('/register', isNotLoggedIn, (req, res) => {
    res.render('login/register')
})
router.post('/requestRegister', isNotLoggedIn, registerValidation, (req, res) => {
    const validation_result = validationResult(req)
    const { user_name, user_email, user_password } = req.body
    if(validation_result.isEmpty()){
        bcrypt.hash(user_password, 12).then(hash_password => {
            return db.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [user_name, user_email, hash_password, roles.User])
            .then(result => {
                return res.redirect('/register/success')
            }).catch(err => {throw err})
        }).catch(err => {throw err})
    }
    else{
        let allError = validation_result.errors.map(err => err.msg)
        res.render('login/register', {
            errors : allError,
            user : req.session.user
        })
    }
})
router.get('/register/success', isNotLoggedIn, (req, res) => {
    res.render('login/registerSuccess', {
        user : req.session.user
    })
})

module.exports = router