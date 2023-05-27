module.exports.printcookie =  (req , res, next)=>{
    console.log("in print cookie");
    console.log(req.cookies.jwt);
    next();
}