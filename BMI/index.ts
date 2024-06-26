import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
//const express = require('express');
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  console.log(req.query);
  const height: number = Number(req.query.height);
  const weight: number = Number(req.query.weight);
  console.log(height, weight);

  try {
    const bmiResult = calculateBmi(height, weight);

    res.json({
      weight: weight,
      height: height,
      bmi: bmiResult,
    });
  } catch {
    res.status(400).json({
      error: 'malformatted parameters',
    });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  console.log('REQUEST', req.body);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const daily_exercises: number[] = req.body.daily_exercises;
  //console.log(calculateExercises(daily_exercises, target));
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!req.body.target) {
      throw new Error('parameters missing');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const target: number = Number(req.body.target);
    const result = calculateExercises(daily_exercises, target);
    res.json({
      result,
    });
  } catch (error) {
    res.status(400).json({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      error: error.message,
    });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
