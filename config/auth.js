module.exports = {
    ensureAuthentication : function(req,res,next){
        if(req.isAuthenticated()) {
            next();
        } else {
            req.flash('error_msg','Log in to access the resource');
            res.redirect('/users/login');
        }
    }
}