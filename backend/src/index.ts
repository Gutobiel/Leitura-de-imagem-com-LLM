import express from 'express';
import bodyParser from 'body-parser';
import { measureRouter } from './controllers/medidorController';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', measureRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
