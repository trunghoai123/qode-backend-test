import client from './config/db.config.js';
import express from 'express';
import cors from 'cors';
await client
  .connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error:', err));

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/post', async (req, res) => {
  const { imageUrls } = req.body;
  if (!Array.isArray(imageUrls)) {
    return res.status(400).send('Invalid request body');
  }

  try {
    const query = 'INSERT INTO post (image_urls) VALUES ($1)';
    await client.query(query, [imageUrls]);

    res.status(201).send({
      isSuccess: true,
      message: 'Post created successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

app.get('/posts', async (req, res) => {
  try {
    const query = 'SELECT * from post order by created_at desc';
    const response = await client.query(query);

    res.status(201).send({
      isSuccess: true,
      data: response.rows,
      message: 'get posts successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

app.post('/comment', async (req, res) => {
  const { postId, content } = req.body;
  if (!postId || !content.trim()) {
    return res.status(400).send('Invalid request body');
  }

  try {
    const query = 'INSERT INTO comment (post_id, content) VALUES ($1, $2) RETURNING *';
    const response = await client.query(query, [postId, content]);

    res.status(201).send({
      isSuccess: true,
      data: response.rows[0],
      message: 'Comment created successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

app.get('/comment/:postId', async (req, res) => {
  const { postId } = req.params;
  if (!postId) {
    return res.status(400).send('Invalid request body');
  }

  try {
    const query = 'SELECT * FROM comment WHERE post_id = $1 order by created_at desc';
    const response = await client.query(query, [postId]);

    res.status(200).send({
      isSuccess: true,
      data: response.rows,
      message: 'Get comment successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
