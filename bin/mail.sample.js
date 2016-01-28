var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'email@gmail.com',
        pass: 'password'
    }
});

var mailOptions = {
    from: 'admin <email@gmail.com>', 
    to: 'xxx@gmail.com', 
    subject: 'Encoder error mail ', 
    text: 'Please check node ecndoer ', 
    html: '<b>debug! debug! debug! </b>' 
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});