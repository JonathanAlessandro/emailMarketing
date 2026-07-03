const app = require('./app');
const sequelize = require('./config/db');
const EmailLog = require('./models/emailLog');
require('dotenv').config();

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    await EmailLog.sync();

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
