import { useState, useEffect } from 'react';
import { getAllEntries, createEntry } from './diaryService';
import { Entry } from './types';

const App = () => {
  const [newEntry, setNewEntry] = useState({
    date: '',
    weather: '',
    visibility: '',
    comment: '',
  });
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllEntries().then((data) => {
      setEntries(data);
    });
  }, []);

  const entryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      const data = await createEntry({
        date: newEntry.date,
        weather: newEntry.weather,
        visibility: newEntry.visibility,
        comment: newEntry.comment,
      });
      setEntries(entries.concat(data));
      console.log(data);
    } catch (error) {
      setError(error.response.data);
      setTimeout(() => {
        setError('');
      }, 5000);
    }

    setNewEntry({
      date: '',
      weather: '',
      visibility: '',
      comment: '',
    });
  };

  const handleInputChange = (event: React.ChangeEvent) => {
    const { name, value } = event.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  const handleVisibilityChange = (event: React.ChangeEvent) => {
    const visibility = event.target.value;
    setNewEntry({ ...newEntry, visibility });
  };

  const handleWeatherChange = (event: React.ChangeEvent) => {
    const weather = event.target.value;
    setNewEntry({ ...newEntry, weather });
  };

  return (
    <div>
      <h1>Add new entry</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={entryCreation}>
        date
        <input
          type="date"
          name="date"
          value={newEntry.date}
          onChange={handleInputChange}
        />
        <br />
        visibility great
        <input
          type="radio"
          name="visibility"
          value="great"
          checked={newEntry.visibility === 'great'}
          onChange={handleVisibilityChange}
        />
        good
        <input
          type="radio"
          name="visibility"
          value="good"
          checked={newEntry.visibility === 'good'}
          onChange={handleVisibilityChange}
        />
        ok
        <input
          type="radio"
          name="visibility"
          value="ok"
          checked={newEntry.visibility === 'ok'}
          onChange={handleVisibilityChange}
        />
        poor
        <input
          type="radio"
          name="visibility"
          value="poor"
          checked={newEntry.visibility === 'poor'}
          onChange={handleVisibilityChange}
        />
        <br />
        weather sunny
        <input
          type="radio"
          name="weather"
          value="sunny"
          checked={newEntry.weather === 'sunny'}
          onChange={handleWeatherChange}
        />
        rainy
        <input
          type="radio"
          name="weather"
          value="rainy"
          checked={newEntry.weather === 'rainy'}
          onChange={handleWeatherChange}
        />
        cloudy
        <input
          type="radio"
          name="weather"
          value="cloudy"
          checked={newEntry.weather === 'cloudy'}
          onChange={handleWeatherChange}
        />
        stormy
        <input
          type="radio"
          name="weather"
          value="stormy"
          checked={newEntry.weather === 'stormy'}
          onChange={handleWeatherChange}
        />
        windy
        <input
          type="radio"
          name="weather"
          value="windy"
          checked={newEntry.weather === 'windy'}
          onChange={handleWeatherChange}
        />
        <br />
        comment
        <input
          name="comment"
          value={newEntry.comment}
          onChange={handleInputChange}
        />
        <br />
        <button type="submit">add</button>
      </form>
      <h2>Diary entries</h2>
      {entries.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.date}</h3>
          weather: {entry.weather}
          <br />
          visibility: {entry.visibility} <br />
          comment: {entry.comment}
        </div>
      ))}
    </div>
  );
};

export default App;

// id: number;
// date: string;
// weather: string;
// visibility: string;
