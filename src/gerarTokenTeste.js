const crypto = require('crypto');
const token = crypto.createHash('sha256')
  .update(`123-${process.env.UNSUBSCRIBE_SECRET}`)
  .digest('hex');
console.log(token);


