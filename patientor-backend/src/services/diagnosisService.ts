import dataDiagnoses from '../../data/diagnoses';
import { Diagnosis } from '../types';

const diagnosis: Diagnosis[] = dataDiagnoses as Diagnosis[];

const getDiagnosis = (): Diagnosis[] => {
  return diagnosis;
};

export default {
  getDiagnosis,
};
