const express = require('express')
const path = require('path')
const basicRoutes = require('./routes/basicRouters')
const adminRoutes = require('./routes/adminRoutes')
const cookieSession = require('cookie-session')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))

app.use(cookieSession({
    name : 'Session',
    keys : ['key1', 'key2'],
    maxAge : 3600 * 1000
}))

app.use('/', basicRoutes)
app.use('/contract/admin', adminRoutes)

app.use(express.static(path.join(__dirname, 'public')))

app.listen(3000, () => {
    console.log('Server start at port 3000')
})