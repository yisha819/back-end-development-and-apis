import express from 'express';
import authRoutes from './routes/auth.js';
import watchlistRoutes from './routes/watchlist.js';

const app = express();

app.use(express.json());

// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;