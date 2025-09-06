import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createLibrarian, loginLibrarian } from './src/lib/api/auth.ts';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Create Librarian Account
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }
  try {
    const result = await createLibrarian(email, password);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.status(201).json({ message: 'Account created successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Login Librarian
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }
  try {
    const result = await loginLibrarian(email, password);
    if (result.error) {
      return res.status(401).json({ error: result.error });
    }
    res.status(200).json({ message: 'Login successful', token: result.token });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
