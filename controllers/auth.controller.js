const db = require('../models');
const Farmers = db.Farmers;
const Buyers = db.Buyers;
const { hash, compare } = require('../utils/bcrypt');
const { sign } = require('../utils/jwt');

// register
exports.register = async (req, res) => {
  try {
    const { fullname, email, password, role, phone, address, farmer_doc_url } = req.body;

    if (!fullname || !email || !password || !role) {
      return res.status(400).json({ message: 'fullname, email, password and role are required' });
    }

    const lowerEmail = email.toLowerCase();
    const password_hash = await hash(password);

    if (role === 'farmer') {
      const ex = await Farmers.findOne({ where: { email: lowerEmail } });
      if (ex) return res.status(400).json({ message: 'Email already exists (farmer)' });

      const farmer = await Farmers.create({
        fullname,
        email: lowerEmail,
        password_hash,
        phone,
        address,
        farmer_doc_url: farmer_doc_url || null
      });

      const token = sign({ id: farmer.id, role: 'farmer' });
      return res.status(201).json({ message: 'Farmer registered', token, user: { id: farmer.id, fullname: farmer.fullname, email: farmer.email, role: 'farmer' } });

    } else if (role === 'buyer') {
      const ex = await Buyers.findOne({ where: { email: lowerEmail } });
      if (ex) return res.status(400).json({ message: 'Email already exists (buyer)' });

      const buyer = await Buyers.create({
        fullname,
        email: lowerEmail,
        password_hash,
        phone,
        address
      });

      const token = sign({ id: buyer.id, role: 'buyer' });
      return res.status(201).json({ message: 'Buyer registered', token, user: { id: buyer.id, fullname: buyer.fullname, email: buyer.email, role: 'buyer' } });
    } else {
      return res.status(400).json({ message: 'role must be either "farmer" or "buyer"' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Register failed', error: err.message });
  }
};

// login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const lowerEmail = email.toLowerCase();
    let user = null;
    let userRole = role;

    if (userRole === 'farmer') user = await Farmers.findOne({ where: { email: lowerEmail } });
    else if (userRole === 'buyer') user = await Buyers.findOne({ where: { email: lowerEmail } });
    else {
      user = await Farmers.findOne({ where: { email: lowerEmail } });
      userRole = 'farmer';
      if (!user) {
        user = await Buyers.findOne({ where: { email: lowerEmail } });
        userRole = 'buyer';
      }
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = await compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = sign({ id: user.id, role: userRole });
    res.json({ message: 'Login successful', token, user: { id: user.id, fullname: user.fullname, email: user.email, role: userRole } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

