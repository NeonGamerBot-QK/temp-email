const express= require("express")
const jsonStore = require('simple-json-db')
const session = require('express-session')
const uuid = require("uuid")
const config = require("./config")
const exec = require("./execSSH")
const ejs = require('ejs');
const app = express();
const fs = require("fs")
const morgan = require("morgan")
const path = require("path")
var debug = require('debug')('main')
const active_emails =[]
const renderPage = (page, ops) => {
    return ejs.render(fs.readFileSync(path.join(__dirname, 'views', `${page}.ejs`), 'utf8'), ops)
}
const renderTemplate = (page, res, ops) => {
    const data = renderPage("layout", { content: renderPage(page, ops), renderPage, ...ops })
    res.send(data)
    }

//  middle ware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session(config.session))
app.use(morgan("combined"))
app.disable("x-powered-by")

function findAuthHeader(headers) {
    let auth = ""
    if(headers['Authorization']) {
        auth =  headers['Authorization'].split("Password")[1].trim()
    } else if(headers['x-password-auth']) {
auth = headers['x-password-auth'].trim()
    }
    // debug(headers, auth)
    return auth;
}
function Authenticated(req,res,next) {
let loggedIn = "yes";
let full_pass = false;
const header = findAuthHeader(req.headers)
const sessionLoggedIn = req.session.loggedin ?? false
if(!sessionLoggedIn) {
    debug(req.session, sessionLoggedIn)
    loggedIn = "sess";
} else {
    loggedIn = "yes";
full_pass = true;
}
if((!header || header !== config.password) && !full_pass && loggedIn !== "sess") {
debug(loggedIn, header, full_pass, loggedIn)
   
    loggedIn = "header";
} else {
   if(loggedIn !== 'sess') {
    loggedIn = "yes";
   } 

}
debug(loggedIn)
if(loggedIn === "yes") {
    next()
} else if(loggedIn === "header") {
res.json({ status: 401, message: "INVALID AUTH"})
} else if(loggedIn == "sess") {
    res.redirect('/login')
}

}
app.get("/", Authenticated, (req,res) => {
    renderTemplate("index", res, { title: "Email"})

});
app.get("/login", (req,res) => {
    renderTemplate("login", res, { title: "Login"})
})
app.post("/get_email", (req,res) => {
    let ID = active_emails.length
const email = Buffer.from(Date.now().toString().slice(0,2)+uuid.v4().split("-")[0]).toString('hex').slice(0,12) + `@${config.email_host}`
req.session.email = email;
active_emails.push(email)
debug(req.session)
res.status(200).json({ status: 200, email: req.session.email, ID })
})
app.get("/get_email", (req,res) => {
debug(req.session, active_emails)
    
    const email =  active_emails[req.query.from]|| req.session.email
    if(email) {
        res.status(200).json({ status: 200, email })
    }
    else {
        res.status(400).json({ status: 400, message: "No email found" })
    }
    })

    app.get('/email', Authenticated, async (req,res) => {
    const email =  active_emails[req.query.from]|| req.session.email
if(!email) return res.status(400).json({ status: 400, message: "No email found" })
      require('./IMAP_EMAILS')(config.imap, email).then((data) => {
res.json({ status: 200, data })
      })
    })
    app.get('/email/:id', Authenticated, async (req,res) => {
        const email =  active_emails[req.query.from]|| req.session.email
    if(!email) return res.status(400).json({ status: 400, message: "No email found" })
          require('./IMAP_EMAILS')(config.imap, email).then((data) => {
let selectedEmail = data[req.params.id]
if(!selectedEmail) return res.status(400).json({ status: 400, message: "No email found" })
res.json({ status: 200, data: selectedEmail })
          })
        })
app.post("/sendemail", Authenticated, (req,res) => {
const from = active_emails[req.body.from] || req.session.email 
const to = req.body.to
const subject = req.body.subject 
const message = req.body.body 
if(!from) return res.status(400).json({ status: 400, message: "No from provided"})
if(!to) return res.status(400).json({ status: 400, message: "No to provided"})
if(!subject) return res.status(400).json({ status: 400, message: "No subject provided"})
if(!message) return res.status(400).json({ status: 400, message: "No message provided"})
debug("STAT")
switch (config.type) {
    case 'ssh':
        debug('ssh')
        
        exec(config.ssh, `curl -s ${config.url}/email.txt | sendemail -f '"Temp Email" <${from}>' -t ${to} -u '${subject}' `).then((data) => {
res.status(201).json({ status: 201, message: "Email sent" })
        }, (e) => {
            res.status(500).json({ status: 500, message: "Email failed" }) 
        })
      
        break;
case 'internal':
    let c = require("child_process")
    debug('iternal')

try {
    c.execSync(`cat ${__dirname}/public/email.txt | sendemail -f '"Temp Email" <${from}>' -t ${to} -u '${subject}'`)
    res.status(201).json({ status: 201, message: "Email sent" })
} catch (e) {
    res.status(500).json({ status: 500, message: "Email failed" })
}
    break;
    case 'smtp':
        debug('smtp')
        const nodemailer = require("nodemailer")
        const transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port,
            secure: config.smtp.secure,
            auth: {
                user: config.smtp.username,
                pass: config.smtp.password
            },
            tls: { rejectUnauthorized: false }
        })
        debug('transporter')
        transporter.sendMail({
            from: `"Temp Email" <${from}>`,
            to: to,
            subject: subject,

            html: message
        }).then((data) => {
        debug('done')

            res.status(201).json({ status: 201, message: "Email sent" })
        }, (e) => {
        debug('err', e)

            res.status(500).json({ status: 500, message: "Email failed" })
        })
        break;
    default:
        res.status(500).json({ status: 500, message: "Invalid type" })
        break;
}

})
app.post("/login", (req,res) => {
    debug(req.body, config.password)
    if(config.password === req.body.password) {
     req.session.cookie.loggedin = true;
     req.session.loggedin = true;
 res.redirect("/")   
 } else {
     res.redirect("/login?error=1")
 }
 })

app.listen(config.port, () => {
    console.log("[APP] ::"+config.port)
})


