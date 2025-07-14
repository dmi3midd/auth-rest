const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            // host: process.env.SMTP_HOST,
            // port: process.env.SMTP_PORT,
            service: "gmail",
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PW
            }
        });
    }
    
    async sendLink(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `Activation account on ${process.env.API_URL}`,
            text: link,
        });
    }
}

module.exports = new EmailService();