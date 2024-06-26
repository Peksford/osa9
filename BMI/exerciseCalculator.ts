interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (args: number[], a: number): Result => {
  console.log('Args', args, 'a', a);
  if (args.length === 0) throw new Error('parameters missing');
  if (!a || !args) {
    throw new Error('malformatted parameters');
  }
  const avg = args.reduce((a, b) => a + b, 0) / args.length;

  if (isNaN(avg)) {
    throw new Error('malformatted parameters');
  }

  const targetValue = a;
  let ratingValue = 0;
  let ratingDescription = '';

  if (avg < targetValue - 0.5) {
    ratingValue = 1;
    ratingDescription = 'Poor';
  } else if (avg < targetValue) {
    ratingValue = 2;
    ratingDescription = 'Decent';
  } else {
    ratingValue = 3;
    ratingDescription = 'Excellent';
  }
  return {
    periodLength: args.length,
    trainingDays: args.filter((value) => value !== 0).length,
    success: avg >= targetValue,
    rating: ratingValue,
    ratingDescription: ratingDescription,
    target: targetValue,
    average: avg,
  };
};

try {
  const a: number = Number(process.argv[2]);
  const b: number[] = process.argv.slice(3).map((arg) => Number(arg));
  console.log(calculateExercises(b, a));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: ';
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
