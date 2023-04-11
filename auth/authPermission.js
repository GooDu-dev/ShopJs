const db = require('../database/database')

function authRole(req, role){
    return new Promise((resolve, reject) => {
        return db.execute('SELECT role FROM users WHERE id=?', req.session.userID).then(([user_role]) => {
            if(user_role === role){
                resolve()
            }
            else{
                reject("Invalid role")
            }
        }).catch(err => {
            reject(err)
        })
    })
}

module.exports = {
    authRole
}