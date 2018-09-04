
const userModel = require('../models/User');
const Datastore = require('@google-cloud/datastore');
const projectId = 'propertymanagement-207415';
const datastore = new Datastore({
    projectId: projectId
});

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("424866252249-rnmr12b3jo5ab7iacdrh1q56jcrq3al4.apps.googleusercontent.com");

exports.verify = function(req, res, next) {
  var token = req.headers['x-access-token'];
  // console.log('verifying token '+token);
    client.verifyIdToken({
        idToken: token,
        audience: "424866252249-rnmr12b3jo5ab7iacdrh1q56jcrq3al4.apps.googleusercontent.com"
    }).then(function(ticket){
        console.log(ticket);
        if (ticket) {
            userModel.findIdByEmail(ticket.payload.email, function (user, error) {
                if(user) {
                    res.locals.user = user;
                    res.locals.user._id = user[datastore.KEY].id;
                    next();
                } else {
                    console.log(error);
                    return res.status(403).send({
                        success: false,
                        message: 'Unauthorized user.'
                    });
                }
            });

        } else {
            return res.status(403).send({
                success: false,
                message: 'Unauthorized user.'
            });
        }
    }).catch(function(error){
        if(error.toString().indexOf("too late")!=-1){
            return res.status(403).send({
                success: false,
                message: 'Expired token.'
            });
        }else {
            return res.status(403).send({
                success: false,
                message: 'Unauthorized user.'
            });
        }
    });
    // console.log(ticket);

};

exports.tenant = function(req, res, next){
    var token = req.headers['x-access-token'];
  // console.log('verifying token '+token);
    client.verifyIdToken({
        idToken: token,
        audience: "424866252249-rnmr12b3jo5ab7iacdrh1q56jcrq3al4.apps.googleusercontent.com"
    }).then(function(ticket){
        if (ticket) {
            userModel.findIdByEmail(ticket.payload.email, function (user, error) {
                if(user && user.role.toLowerCase() == 'tenant') {
                    res.locals.user = user;
                    res.locals.user._id = user[datastore.KEY].id;
                    next();
                } else {
                    console.log(error);
                    return res.status(403).send({
                        success: false,
                        message: 'Unauthorized user.'
                    });
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'Unauthorized user.'
            });
        }
    }).catch(function(error){
        if(error.toString().indexOf("too late")!=-1){
            return res.status(403).send({
                success: false,
                message: 'Expired token.'
            });
        }else {
            return res.status(403).send({
                success: false,
                message: 'Unauthorized user.'
            });
        }
    });
};