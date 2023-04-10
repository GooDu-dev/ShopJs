function authRole(role){
    return (req, res, next) => {
        if(!req.user.role === role){
            res.redirect('/')
        }
        next()
    }
}

module.exports = {
    authRole
}