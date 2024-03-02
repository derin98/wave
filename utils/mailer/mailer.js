const nodemailer = require('nodemailer');
const smtpConfig = require('../../configs/smtp/smtp.config');
// class Mailer {
//     constructor(config) {
//         console.log('CONFIG MAILER::', config);
//         this.from = config.username;
//         this.googleTransporter = nodemailer.createTransport({
//             host: 'smtp.gmail.com',
//             port: 465,
//             secure: true,
//             auth: {
//                 user: `${config.username}`,
//                 pass: `${config.password}`,
//             },
//         });
//     }
//
//     // for gmail based smtp config
//     async gmailStrategy(to, subject, text, html = '') {
//         console.log('HERE');
//         try {
//             const mailOptions = { to, subject, text };
//             mailOptions.from = `${this.from}`;
//             console.log('MALI::', this.googleTransporter);
//             if (html) {
//                 mailOptions.html = html;
//             }
//             await this.googleTransporter
//                 .verify()
//                 .then(() => console.log('Inside sucess verifications'))
//                 .catch((err) => console.log(err));
//             this.googleTransporter.sendMail(mailOptions, (err, response) => {
//                 if (err) {
//                     console.log('ERROR HERE::', err);
//                 } else {
//                     console.log('RESP::', response);
//                 }
//             });
//             //this.googleTransporter.sendMail(mailOptions);
//         } catch (error) {
//             console.log('ERROR::', error);
//             throw error;
//         }
//     }
// }
//
// module.exports = Mailer;
//

const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
        user: smtpConfig.username,
        pass: smtpConfig.password,
    },
});

const sendEmail = (to, subject, credentials) => {
    const html = `
        <html>
            <head>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h2 {
                        color: #4285f4;
                    }
                    p {
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Welcome to Wave!</h2>
                    <p>Your account has been successfully created. Here are your registration details:</p>
                    <ul>
                        <li><strong>EmployeeId:</strong> ${credentials.employeeId}</li>
                        <li><strong>Email:</strong> ${credentials.email}</li>
                        <li><strong>Password:</strong> ${credentials.password}</li>
                    </ul>
                    <p>Thank you!</p>
                </div>
            </body>
        </html>
    `;

    const mailOptions = {
        from: smtpConfig.username,
        to: to,
        subject: subject,
        html: html,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};

module.exports = {
    sendEmail
};