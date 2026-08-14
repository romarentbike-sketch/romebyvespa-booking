import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import availabilityRoutes from './routes/availability.js';
import bookingRoutes from './routes/booking.js';
import webhookRoutes from './routes/webhook.js';
import adminRoutes from './routes/admin.js';

const app = express();

// --------------------------------------------------------------
// IMPORTANTE: il webhook Stripe deve ricevere il body RAW (non JSON),
// quindi va montato PRIMA di express.json() e con il suo parser dedicato.
// --------------------------------------------------------------
app.use('/api', express.raw({ type: 'application/json' }), webhookRoutes);

// Da qui in poi, JSON parsing normale per tutte le altre route
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

app.use('/api', availabilityRoutes);
app.use('/api', bookingRoutes);
app.use('/api', adminRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Rome by Vespa booking server in ascolto sulla porta ${port}`);
});
