export interface Entry {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment?: string;
}

export type NewEntry = Omit<Entry, 'id'>;
