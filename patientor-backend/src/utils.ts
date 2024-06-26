import {
  newPatient,
  Gender,
  EntryWithoutId,
  Diagnosis,
  HealthCheckRating,
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (param: unknown): param is number => {
  return typeof param === 'number' || param instanceof Number;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }
  return ssn;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error('Incorrect or missing employer name');
  }
  return employerName;
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description');
  }
  return description;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

const isDate = (date: string): boolean => {
  console.log(Boolean(Date.parse(date)));
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect gender: ' + gender);
  }
  return gender;
};

// const parseDateOfBirth = (dateOfBirth: unknown): string => {
//   if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
//     throw new Error('Incorrect or missing date ' + dateOfBirth);
//   }

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date ' + date);
  }

  return date;
};

const parseHealthCheckRating = (
  healthCheckRating: unknown
): HealthCheckRating => {
  if (
    healthCheckRating === undefined ||
    !isNumber(healthCheckRating) ||
    !Object.values(HealthCheckRating).includes(healthCheckRating)
  ) {
    throw new Error(
      'Value of healthCheckRating incorrect: ' + healthCheckRating
    );
  }
  return healthCheckRating as HealthCheckRating;
};

const isEntriesArray = (entries: unknown): entries is unknown[] => {
  return Array.isArray(entries);
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object') {
    console.log('Paaseeko tanne');
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object as Array<Diagnosis['code']>;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }
  return specialist;
};
export const parseEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  //console.log('testing parseEntry', object);

  const entry = object as {
    type: string;
    date?: unknown;
    specialist?: unknown;
    description?: unknown;
    diagnosisCodes?: unknown;
    discharge?: {
      date: unknown;
      criteria: unknown;
    };
    healthCheckRating?: unknown;
    employerName?: unknown;
    sickLeave?: { startDate: unknown; endDate: unknown };
  };

  switch (entry.type) {
    case 'Hospital':
      return {
        type: 'Hospital',
        date: parseDate(entry.date),
        specialist: parseSpecialist(entry.specialist),
        description: parseDescription(entry.description),
        diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes),
        discharge: {
          date: parseDate(entry.discharge?.date),
          criteria: parseName(entry.discharge?.criteria),
        },
      };
    case 'HealthCheck':
      return {
        type: 'HealthCheck',
        date: parseDate(entry.date),
        specialist: parseSpecialist(entry.specialist),
        description: parseDescription(entry.description),
        healthCheckRating: parseHealthCheckRating(entry.healthCheckRating),
        diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes),
      };
    case 'OccupationalHealthcare':
      return {
        type: 'OccupationalHealthcare',
        date: parseDate(entry.date),
        specialist: parseSpecialist(entry.specialist),
        description: parseDescription(entry.description),
        employerName: parseEmployerName(entry.employerName),
        diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes),
        sickLeave: {
          startDate: parseDate(entry.sickLeave?.startDate),
          endDate: parseDate(entry.sickLeave?.endDate),
        },
      };
    default:
      throw new Error('Incorrect entry type');
  }
};

export const toNewPatient = (object: unknown): newPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }
  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object &&
    'entries' in object &&
    isEntriesArray(object.entries)
  ) {
    const newPat: newPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: object.entries.map(parseEntry),
    };

    return newPat;
  }

  const missingFields = [];
  if (!('name' in object)) missingFields.push('name');
  if (!('dateOfBirth' in object)) missingFields.push('dateOfBirth');
  if (!('ssn' in object)) missingFields.push('ssn');
  if (!('gender' in object)) missingFields.push('gender');
  if (!('occupation' in object)) missingFields.push('occupation');
  if (!('entries' in object)) missingFields.push('entries');
  else if (!isEntriesArray(object.entries))
    missingFields.push('entries is not an array');

  throw new Error(
    `Incorrect data: a field missing', ${missingFields.join(', ')}`
  );
};

// "id": "d2773336-f723-11e9-8f0b-362b9e155667",
//         "name": "John McClane",
//         "dateOfBirth": "1986-07-09",
//         "ssn": "090786-122X",
//         "gender": "male",
//         "occupation": "New york city cop"
