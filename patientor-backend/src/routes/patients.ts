import express from 'express';
import patientsService from '../services/patientsService';
import { toNewPatient } from '../utils';
import { parseEntry } from '../utils';
import { EntryWithoutId } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
  //const diagnoses = diagnosisService.getDiagnosis();
  res.json(patientsService.getNonSensitivePatients());
});

router.get('/:id', (_req, res) => {
  const id: string = _req.params.id;
  res.send(patientsService.getPatient(id));
});

router.post('/:id/entries', (req, res) => {
  try {
    const patientId: string = req.params.id;
    console.log('request body for entry', req.body);
    const newEntry: EntryWithoutId = parseEntry(req.body);
    const updatedPatient = patientsService.addEntry(newEntry, patientId);
    res.send(updatedPatient);
    console.log('updated patient router', updatedPatient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: 'unknown error appeared' });
    }
  }

  //res.json(newEntry);
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    console.log('jeejee', newPatient);
    const addedPatient = patientsService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;

// "id": "d2773336-f723-11e9-8f0b-362b9e155667",
//         "name": "John McClane",
//         "dateOfBirth": "1986-07-09",
//         "ssn": "090786-122X",
//         "gender": "male",
//         "occupation": "New york city cop"
