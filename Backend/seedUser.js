const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('./module/User'); // Adjust path if needed

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Seed Users
const seedUsers = async () => {
  try {
    const users = [
      { email: 'sarthak12005@gmail.com', password: 'sarthak_12', role: 'admin', refreshrefreshToken: "" },
      { email: 'dash2006@gmail.com', password: 'dash@2006', role: 'user',refreshrefreshToken: "" },
      { email: 'bestdash2006@gmail.com', password: 'bestdash@2006', role: 'bestuser', refreshrefreshToken: "" }
    ];

    for (const user of users) {
      // Check if the user already exists
      const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        console.log(`User with email ${user.email} already exists.`);
        continue;
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      // Save to DB
      await User.create(user);
      console.log(`User ${user.email} added successfully.`);
    }

    console.log('All users added!');
    process.exit();
  } catch (err) {
    console.error('Error seeding users:', err);
    process.exit(1);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await seedUsers();
};

run();
