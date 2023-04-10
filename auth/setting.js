function isSessionCreated(req, res){
    return new Promise((resolve, reject) => {
        if(typeof(req.session) === "undefined"){
            req.session = {}
            req.session.loggedIn = false
            req.session.userID = null
            resolve()
        }
        else{
            reject()
        }
    })
}
module.exports = {
    isSessionCreated
}