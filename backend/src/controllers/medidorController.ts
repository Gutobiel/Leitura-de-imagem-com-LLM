import express, { Request, Response } from 'express';
import { uploadMeasurement, confirmMeasurement, listMeasurements } from '../services/medidorService';

export const measureRouter = express.Router();

measureRouter.post('/upload', async (req: Request, res: Response) => {
  try {
    const result = await uploadMeasurement(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
});

measureRouter.patch('/confirm', async (req: Request, res: Response) => {
  try {
    const result = await confirmMeasurement(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
});

measureRouter.get('/:customer_code/list', async (req: Request, res: Response) => {
  try {
    const { customer_code } = req.params;
    const measure_type = req.query.measure_type as string | undefined;
    const result = await listMeasurements(customer_code, measure_type);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred." });
    }
  }
});
