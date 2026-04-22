import express from 'express';
import { prisma } from '../lib/prisma';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Prisma API!');
});



app.post('/user', async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});


app.get('/users/email/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user by email' });
  }
});


app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { Userid: id },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.get('/user', async (req, res) => {
  try {
    const user = await prisma.user.findMany();
    res.json(user);
  }
  catch (error) {
    res.status(500).json({ error:'Failed to fetch user'});
  }
});

app.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await prisma.user.update ({
      where: { Userid : id},
      data: { name, email },
    });
    res.json(user);
  }
  catch (error) {
    res.status(500).json({ error: 'fail to update user'});
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});