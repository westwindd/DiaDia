import express from 'express';
import getPdfAndConvert from './getAndConvert.js';

const app = express();

app.use(express.json());

app.post('/getPdfAndConvert', async (req, res) => {
  try {
    const output = await getPdfAndConvert(req, res);
    res.status(200).json(output);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});