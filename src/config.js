require("dotenv").config()
module.exports = {
    port: process.env.PORT || process.env.SERVER_PORT || 3000,
    session: {
        secret: process.env.SESSION_SECRET || require("crypto").randomUUID().split('-').join(''),
        cookie: {  maxAge: 30 * 24 * 60 * 60 * 1000 }
    },
    host: process.env.HOST || "localhost",
    email_host: process.env.EMAIL_HOST,
    url: process.env.URL || "http://localhost:3000",
    ssh: {
        enabled: process.env.TYPE === "ssh",
        host: process.env.SSH_HOST,
        port: process.env.SSH_PORT,
        username: process.env.SSH_USERNAME,
        password: process.env.SSH_PASSWORD
    },
    smtp: {
        enabled: process.env.TYPE === "smtp",
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: Boolean('true' === process.env.SMTP_SECURE),
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD
    },
    imap: {
host: process.env.IMAP_HOST,
port: process.env.IMAP_PORT,
tls: Boolean('true' === process.env.IMAP_TLS),
user: process.env.IMAP_USER,
password: process.env.IMAP_PASSWORD

    },
    password: process.env.PASSWORD,
    type: process.env.TYPE || 'internal'
}