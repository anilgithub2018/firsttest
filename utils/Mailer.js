const nodemailer = require('nodemailer');
const jadeCompiler = require('../utils/JadeCompiler');

var Mailer = {};
Mailer.send = function(to, subject, template, data) {

    let transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'devhashbinary@gmail.com',
            pass: 'thisisadummydevaccount'
        }
    });

    jadeCompiler.compile(template, data, function(err, html) {
        if (err) {
            throw new Error('Problem compiling template(double check relative path): ' + template);
        } else {

            let mailOptions = {
                from: '"Hashbinary" <devhashbinary@gmail.com>', // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                text: '', // plain text body
                html: html // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if(error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            });
        }

    });
}

Mailer.sendAttachment = function(to, subject, stream) {

    let transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'devhashbinary@gmail.com',
            pass: 'thisisadummydevaccount'
        }
    });
    let mailOptions = {
        from: '"Hashbinary" <devhashbinary@gmail.com>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: '', // plain text body
        attachments: [{
            filename: 'Broker Order.pdf',
            content: stream
        }]
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    });
}

module.exports = Mailer;