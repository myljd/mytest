

exports.isAuthorized = function (req, res, next) {
  if (req.session.user) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    next();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
    req.session.error = 'Access denied!';
    console.log("Access denied!");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    res.redirect('/login')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
}