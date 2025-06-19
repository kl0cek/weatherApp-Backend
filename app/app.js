import express from 'express';
import weatherRoutes from './forecast/routes/weatherRoutes.js';
const app = express();

app.use(express.json());
app.get('/api/test', (req, res) => {
  res.send('API działa!');
});

app.use('/api', weatherRoutes);

app.use((err, req, res, next) =>{
    console.log(err.stack);
    res.status(500).json( { error: 'Internal Server Error'});
});

export default app;