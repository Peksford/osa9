export const calculateBmi = (a: number, b: number): string => {
  if (a === 0) throw new Error("Can't divide by 0!");
  if (!a || !b) throw new Error('No height or weight');
  if (a < 0 || b < 0) throw new Error('height or weight under 0');
  const value = b / (a / 100) ** 2;
  if (value < 18.5) {
    return 'Under (underweight)';
  } else if (value >= 18.5 && value <= 24.9) {
    return 'Normal (healthy weight)';
  } else if (value >= 25 && value <= 29.9) {
    return 'Over (overweight)';
  } else {
    return 'Obesity';
  }
};

try {
  const a: number = Number(process.argv[2]);
  const b: number = Number(process.argv[3]);
  console.log(calculateBmi(a, b));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: ';
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}

//export default calculateBmi;
