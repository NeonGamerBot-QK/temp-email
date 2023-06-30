const {Client} = require("ssh2")
var debug = require('debug')('main:ssh')

const exec = (config, cmd) => {
    return new Promise((res,rej) => {
        const conn = new Client();
        conn.on('ready', () => {
          debug('Client :: ready');
          conn.exec(cmd, (err, stream) => {
            if (err) rej(err);
            let str = ""
            stream.on('close', (code, signal) => {
              debug('Stream :: close :: code: ' + code + ', signal: ' + signal);
              conn.end();
              res(str)

            }).on('data', (data) => {
                str += data.toString()
              debug('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                str += data.toString()

              debug('STDERR: ' + data);
            });
          });
        }).connect(config);
        
    })
}
 module.exports = exec;