const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));

const PORT = process.env.PORT || 6200;

// Sync Database and Start Server
sequelize.sync({ force: false }).then(() => {
  console.log('Central Auth Database Synced');
  app.listen(PORT, () => {
    console.log(`Central Auth Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
