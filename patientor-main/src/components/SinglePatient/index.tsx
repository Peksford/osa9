import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import patientService from '../../services/patients';
import { Patient, Diagnosis } from '../../types';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { green, yellow, brown } from '@mui/material/colors';
import AddEntryForm from './AddEntryForm';

const SinglePatient = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await patientService.getSingle(id);
        setPatient(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchPatient();
  }, [id]);

  useEffect(() => {
    const fetchDiagnose = async () => {
      try {
        const data = await patientService.getDiagnoses();
        setDiagnoses(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchDiagnose();
  }, []);

  const HospitalEntry: React.FC<Props> = ({ entry }) => {
    return (
      <div>
        {entry.date}
        <br />
        {entry.diagnosisCodes.map((code) => {
          const diagnoseText = diagnoses.find((d) => d.code === code);
          return (
            <div key={code}>
              {code} {<i>{diagnoseText ? diagnoseText.name : ''}</i>}
            </div>
          );
        })}
        diagnose by {entry.specialist}
      </div>
    );
  };

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const OccupationalEntry: React.FC<Props> = ({ entry }) => {
    return (
      <div>
        {entry.date} {<WorkIcon />} {<i>{entry.employerName}</i>}
        <br />
        {<i>{entry.description}</i>}
        <br />
        {entry.diagnosisCodes &&
          entry.diagnosisCodes.map((code) => {
            const diagnoseText = diagnoses.find((d) => d.code === code);
            return (
              <div key={code}>
                {code} {<i>{diagnoseText ? diagnoseText.name : 'loading'}</i>}
              </div>
            );
          })}
        diagnose by {entry.specialist}
      </div>
    );
  };

  const HealthcheckEntry: React.FC<Props> = ({ entry }) => {
    return (
      <div>
        {entry.date} {<MedicalServicesIcon />}
        <br />
        <i>{entry.description}</i>
        {entry.diagnosisCodes &&
          entry.diagnosisCodes.map((code) => {
            const diagnoseText = diagnoses.find((d) => d.code === code);
            return (
              <div key={code}>
                {code} {<i>{diagnoseText ? diagnoseText.name : ''}</i>}
              </div>
            );
          })}
        {entry.healthCheckRating === 0 && (
          <FavoriteIcon sx={{ color: green[500] }} />
        )}
        {entry.healthCheckRating === 1 && (
          <FavoriteIcon sx={{ color: yellow[500] }} />
        )}
        {entry.healthCheckRating === 2 && (
          <FavoriteIcon sx={{ color: brown[500] }} />
        )}
        {entry.healthCheckRating === 3 && <FavoriteIcon />}
        <br />
        diagnose by {entry.specialist}
      </div>
    );
  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case 'Hospital':
        return <HospitalEntry entry={entry} />;
      case 'OccupationalHealthcare':
        return <OccupationalEntry entry={entry} />;
      case 'HealthCheck':
        return <HealthcheckEntry entry={entry} />;
      default:
        assertNever(entry);
    }
  };
  return (
    <div>
      {patient ? (
        <div>
          <h1>
            {patient[0].name}
            {patient[0].gender === 'female' && <FemaleIcon />}{' '}
            {patient[0].gender === 'male' && <MaleIcon />}
          </h1>
          <pre>ssh: {patient[0].ssn}</pre>
          <pre>occupation: {patient[0].occupation}</pre>

          <AddEntryForm diagnoses={diagnoses} id={id} />

          <br />
          <br />
          <h2>entries</h2>
          {Object.values(patient).map((patient: Patient) => (
            <div key={patient.id}>
              {patient.entries.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    border: '1px solid black',
                    padding: '10px',
                    marginBotto: '10px',
                  }}
                >
                  <EntryDetails entry={entry} />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div>no patient</div>
      )}
    </div>
  );
};

export default SinglePatient;
