import dataPatients from '../../data/patients';
import {
  NonSensitivePatient,
  newPatient,
  Entry,
  EntryWithoutId,
} from '../types';
import { v1 as uuid } from 'uuid';

console.log(dataPatients);

const patients: NonSensitivePatient[] = dataPatients as NonSensitivePatient[];

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(
    ({ id, name, dateOfBirth, gender, occupation, entries }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      entries,
    })
  );
};

const getPatient = (id: string): NonSensitivePatient[] => {
  return patients.filter((patient) => patient.id === id);
};

const addPatient = (patient: newPatient): NonSensitivePatient => {
  console.log('Testing new patient', patient);
  const newPatient = {
    id: uuid(),
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    ssn: patient.ssn,
    gender: patient.gender,
    occupation: patient.occupation,
    entries: patient.entries.map((entry) => ({ ...entry, id: uuid() })),
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (entry: EntryWithoutId, patientId: string): Entry => {
  const patient = patients.find((p) => p.id === patientId);
  console.log('diagnosesCodes not anymore involved', entry);
  if (!patient) {
    throw new Error('Patient no found');
  }
  const newEntry = {
    id: uuid(),
    ...entry,
  };
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getNonSensitivePatients,
  addPatient,
  getPatient,
  addEntry,
};
