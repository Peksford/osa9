import { useState } from 'react';
import * as React from 'react';
import { TextField, MenuItem, Menu, Grid, Button } from '@mui/material';
import patientService from '../../services/patients';
import { EntryWithoutId } from '../../types';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(code: string, diagnoseCode: string[], theme: Theme) {
  return {
    fontWeight:
      diagnoseCode.indexOf(code) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const AddEntryForm = ({ id, diagnoses }) => {
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  //const [diagnosisCodes, setDiagnosisCodes] = useState('');
  const [description, setDescription] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [type, setType] = useState('');
  const [discharge, setDischarge] = useState({ date: '', criteria: '' });
  const [employerName, setEmployerName] = useState('');
  const [sickLeave, setSickLeave] = useState({ startDate: '', endDate: '' });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [diagnoseCodes, setDiagnoseCodes] = React.useState<string[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (type?: string) => {
    setAnchorEl(null);
    if (type) {
      setType(type);
    }
  };

  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof diagnoseCodes>) => {
    const {
      target: { value },
    } = event;
    setDiagnoseCodes(typeof value === 'string' ? value.split(',') : value);
  };

  const onCancel = () => {
    setErrorMessage('');
    setHealthCheckRating('');
    setDate('');
    setSpecialist('');
    setDiagnoseCodes([]);
    setDescription('');
    setDischarge({ date: '', criteria: '' });
    setSickLeave({ startDate: '', endDate: '' });
    setEmployerName('');
  };

  const ErrorShow = () => {
    return (
      <div
        style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '10px',
        }}
      >
        {errorMessage}
      </div>
    );
  };

  const addEntry = async (event: SyntheticEvent) => {
    event.preventDefault();

    let newEntry: EntryWithoutId;
    switch (type) {
      case 'Hospital':
        newEntry = {
          type,
          date,
          specialist,
          description,
          diagnoseCodes,
          discharge: {
            date: discharge?.date,
            criteria: discharge?.criteria,
          },
        };
        break;
      case 'HealthCheck':
        newEntry = {
          type: type,
          date: date,
          specialist: specialist,
          description: description,
          healthCheckRating: healthCheckRating,
          diagnosisCodes: diagnoseCodes,
        };
        break;
      case 'OccupationalHealthcare':
        newEntry = {
          type: type,
          date: date,
          specialist: specialist,
          description: description,
          employerName: employerName,
          diagnosisCodes: diagnoseCodes,
          sickLeave: {
            startDate: sickLeave?.startDate,
            endDate: sickLeave?.endDate,
          },
        };
        break;
      default:
        throw new Error('Incorrect entry type');
    }

    try {
      await patientService.createEntry(newEntry, id);
      setErrorMessage('');
      setHealthCheckRating('');
      setDate('');
      setSpecialist('');
      setDiagnoseCodes([]);
      setDescription('');
      setDischarge({ date: '', criteria: '' });
      setSickLeave({ startDate: '', endDate: '' });
      setEmployerName('');
    } catch (error) {
      if (error instanceof Error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(error.request.responseText);
        } else {
          setErrorMessage(error.message);
        }
      } else {
        console.error('Unknown error', error);
        setErrorMessage('Uknown error');
      }
    }
  };
  return (
    <div>
      <h2>New HealthCheck Entry</h2>
      {errorMessage && <ErrorShow />}
      <form onSubmit={addEntry}>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{ padding: '14px 20px', fontSize: '1.5rem' }}
        >
          {type || 'Select Entry Type'}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose()}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => handleClose('HealthCheck')}>
            HealthCheck
          </MenuItem>
          <MenuItem onClick={() => handleClose('OccupationalHealthcare')}>
            Occupational Healthcare
          </MenuItem>
          <MenuItem onClick={() => handleClose('Hospital')}>Hospital</MenuItem>
        </Menu>
        <br />
        {type === 'HealthCheck' && (
          <>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="diagnoseCodes-label">Diagnose</InputLabel>
              <Select
                labelId="diagnoseCodes-label"
                id="DiagnoseCode"
                multiple
                value={diagnoseCodes}
                onChange={handleChange}
                input={<OutlinedInput label="Codes" />}
                MenuProps={MenuProps}
              >
                {diagnoses.map((diagnosis) => (
                  <MenuItem
                    key={diagnosis.code}
                    value={diagnosis.code}
                    style={getStyles(diagnosis.code, diagnoseCodes, theme)}
                  >
                    {diagnosis.code} - {diagnosis.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Selected Diagnoses"
              fullWidth
              value={diagnoseCodes ? diagnoseCodes.join(', ') : ''}
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              type="date"
              value={date}
              onChange={({ target }) => setDate(target.value)}
            />
            <TextField
              label="HealthCheckRating"
              type="number"
              fullWidth
              value={healthCheckRating}
              onChange={({ target }) =>
                setHealthCheckRating(Number(target.value))
              }
            />
            <TextField
              label="Specialist"
              fullWidth
              value={specialist}
              onChange={({ target }) => setSpecialist(target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
          </>
        )}
        {type === 'Hospital' && (
          <>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="diagnoseCodes-label">Diagnose</InputLabel>
              <Select
                labelId="diagnoseCodes-label"
                id="DiagnoseCode"
                multiple
                value={diagnoseCodes}
                onChange={handleChange}
                input={<OutlinedInput label="Codes" />}
                MenuProps={MenuProps}
              >
                {diagnoses.map((diagnosis) => (
                  <MenuItem
                    key={diagnosis.code}
                    value={diagnosis.code}
                    style={getStyles(diagnosis.code, diagnoseCodes, theme)}
                  >
                    {diagnosis.code} - {diagnosis.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Selected Diagnoses"
              fullWidth
              value={diagnoseCodes ? diagnoseCodes.join(', ') : ''}
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              type="date"
              value={date}
              onChange={({ target }) => setDate(target.value)}
            />
            <TextField
              label="Discharge Date"
              fullWidth
              value={discharge.date}
              onChange={({ target }) =>
                setDischarge({ ...discharge, date: target.value })
              }
            />
            <TextField
              label="Discharge Criteria"
              fullWidth
              value={discharge.criteria}
              onChange={({ target }) =>
                setDischarge({ ...discharge, criteria: target.value })
              }
            />
            <TextField
              label="Specialist"
              fullWidth
              value={specialist}
              onChange={({ target }) => setSpecialist(target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
          </>
        )}
        {type === 'OccupationalHealthcare' && (
          <>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="diagnoseCodes-label">Diagnose</InputLabel>
              <Select
                labelId="diagnoseCodes-label"
                id="DiagnoseCode"
                multiple
                value={diagnoseCodes}
                onChange={handleChange}
                input={<OutlinedInput label="Codes" />}
                MenuProps={MenuProps}
              >
                {diagnoses.map((diagnosis) => (
                  <MenuItem
                    key={diagnosis.code}
                    value={diagnosis.code}
                    style={getStyles(diagnosis.code, diagnoseCodes, theme)}
                  >
                    {diagnosis.code} - {diagnosis.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Selected Diagnoses"
              fullWidth
              value={diagnoseCodes ? diagnoseCodes.join(', ') : ''}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="date"
              type="date"
              fullWidth
              value={date}
              onChange={({ target }) => setDate(target.value)}
              InputLabelProps={{ shrink: true }}
              placeholder="dd.mm.yyyy"
            />
            <TextField
              label="Sickleave Start Date"
              fullWidth
              type="date"
              value={sickLeave.startDate}
              onChange={({ target }) =>
                setSickLeave({ ...sickLeave, startDate: target.value })
              }
              InputLabelProps={{ shrink: true }}
              placeholder="dd.mm.yyyy"
            />
            <TextField
              label="Sickleave End Date"
              fullWidth
              type="date"
              value={sickLeave.endDate}
              onChange={({ target }) =>
                setSickLeave({ ...sickLeave, endDate: target.value })
              }
              InputLabelProps={{ shrink: true }}
              placeholder="dd.mm.yyyy"
            />
            <TextField
              label="Employer Name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <TextField
              label="Specialist"
              fullWidth
              value={specialist}
              onChange={({ target }) => setSpecialist(target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
          </>
        )}
        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: 'left' }}
              type="button"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <Button
            style={{
              float: 'right',
            }}
            type="submit"
            variant="contained"
          >
            Add
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;
