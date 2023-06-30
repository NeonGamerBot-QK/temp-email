const Imap = require('imap');
var debug = require('debug')('main:imap')

//  const simpleParser = require('simpleParser')
const {simpleParser} = require('mailparser');
const getEmails = (config, email) => {

   return new Promise((res,rej) => {
    try {
      const raw_emails = []
      const imap = new Imap(config);
      imap.once('ready', () => {
        imap.openBox('INBOX', false, () => {
          imap.search(['UNSEEN', ['SINCE',0]], (err, results) => {
            if(err) {
              console.error("#err5")
              return rej(err.message)
            }
       let f;     
try {
  f = imap.fetch(results, {bodies: ''});

} catch (e) {
  console.error("#err6")
  // return rej(e)
  if(e.message === 'Nothing to fetch') {
    return res([])
  }
  console.error(e.message, "YES")
  return;
}
            f.on('message', msg => {
              msg.on('body', stream => {
              raw_emails.push(stream)
               
              });
              msg.once('attributes', attrs => {
                const {uid} = attrs;
                // imap.addFlags(uid, ['\\Seen'], () => {
                //   // Mark the email as read after reading it
                //   // debug('Marked as read!');
                // });
              });
            });
            f.once('error', ex => {
              debug('err4')
              return rej(ex.message);
            });
            f.once('end', () => {
              // debug('Done fetching all messages!');
              imap.end();
            });
          })
        })
      });
  
      imap.once('error', err => {
        debug("ERR2")
rej(err.message)
      });
  
      imap.once('end', async () => {
        let emails = []
        
       for(const stream of raw_emails) {
        let parsed = await simpleParser(stream)
        // debug(parsed.to.value[0].address, email)
        if(parsed.to.value[0].address === email) {
          emails.push(parsed)
        } 
      }
        res(emails)

        debug('Connection ended');
      });
  
      imap.connect();
    } catch (ex) {
      // debug('an error occurred', ex);
      console.error("ERR")
    //  if(ex.message === '')
      rej(ex.message)
    }
   })
  };
  

  module.exports = getEmails;