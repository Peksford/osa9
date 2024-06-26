import axios from 'axios';
import {
  Patient,
  PatientFormValue,
  Diagnosis,
  EntryWithoutId,
  newPatient,
} from '../types';
import { apiBaseUrl } from '../constants';
import { v1 as uuid } from 'uuid';

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

  return data;
};

const create = async (object: PatientFormValue) => {
  const newPatient = {
    dateOfBirth: object.dateOfBirth,
    gender: object.gender,
    name: object.name,
    occupation: object.occupation,
    ssn: object.ssn,
    id: uuid(),
    entries: [],
  };
  console.log('new patient', newPatient);
  try {
    const { data } = await axios.post<newPatient>(
      `${apiBaseUrl}/patients`,
      newPatient
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error message: ', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    } else {
      console.error('Non-axios error:', error);
    }
    throw error;
  }
};

const createEntry = async (object: EntryWithoutId, id: string) => {
  console.log('entry check', id);

  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${id}/entries`,
    object
  );
  return data;
};

const getSingle = async (id: string) => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients/${id}`);
  return data;
};

const getDiagnoses = async () => {
  const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
  return data;
};

export default {
  getAll,
  create,
  getSingle,
  getDiagnoses,
  createEntry,
};
