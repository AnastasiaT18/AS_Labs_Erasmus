const crypto = require('crypto');


export function getToken(){
    return crypto.randomBytes(32).toString("hex");
}