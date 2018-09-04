let pdf = require('html-pdf');
let jadeCompiler = require('./JadeCompiler');

exports.generateInvoice = function(order){
    return new Promise(function(resolve, reject){
        jadeCompiler.compile('invoice', order, function(err, html) {
            if(err){
                console.log(error);
                reject(error);
            } else {
                pdf.create(html).toStream(function(error, stream){
                    if(error){
                        console.log(error);
                        reject(error);
                    } else {
                        resolve(stream);
                    }
                });
            }
        });
    });
}