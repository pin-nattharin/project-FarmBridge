// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./models');

app.use(cors());
app.use(express.json({ limit: '5mb' })); // base64 images may be large
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/listings', require('./routes/listing.routes'));

// health
app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database synced');
  app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
}).catch(err => {
  console.error('DB sync failed', err);
});
