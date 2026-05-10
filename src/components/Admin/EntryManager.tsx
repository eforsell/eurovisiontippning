import { FC, useState } from 'react';
import { Database } from '../../types/database.types';

type Entry = Database['public']['Tables']['entries']['Row'];

interface EntryManagerProps {
  entries: Entry[];
  onSave: (entry: Partial<Entry>) => void;
  onDelete: (id: string) => void;
}

export const EntryManager: FC<EntryManagerProps> = ({ entries, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Partial<Entry>>({
    country: '',
    artist: '',
    song_title: '',
    start_position: 1,
    starting_contest: 'semi1'
  });

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditingEntry({
      country: '',
      artist: '',
      song_title: '',
      start_position: entries.length + 1,
      starting_contest: 'semi1'
    });
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditingEntry(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editingEntry);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Entries</h3>
        <button
          onClick={handleAddNew}
          className="text-white bg-primary hover:bg-primary-dark font-medium rounded-lg text-sm px-4 py-2"
        >
          Add Entry
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium">Country</label>
              <input type="text" id="country" name="country" value={editingEntry.country} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            </div>
            <div>
              <label htmlFor="artist" className="block text-sm font-medium">Artist</label>
              <input type="text" id="artist" name="artist" value={editingEntry.artist} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            </div>
            <div>
              <label htmlFor="song_title" className="block text-sm font-medium">Song</label>
              <input type="text" id="song_title" name="song_title" value={editingEntry.song_title} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
            </div>
            <div>
              <label htmlFor="starting_contest" className="block text-sm font-medium">Starting Contest</label>
              <select id="starting_contest" name="starting_contest" value={editingEntry.starting_contest} onChange={handleChange} className="mt-1 block w-full rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                <option value="semi1">Semi-final 1</option>
                <option value="semi2">Semi-final 2</option>
                <option value="final">Final</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">Save Entry</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Country</th>
              <th scope="col" className="px-6 py-3">Artist</th>
              <th scope="col" className="px-6 py-3">Song</th>
              <th scope="col" className="px-6 py-3">Contest</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{entry.country}</td>
                <td className="px-6 py-4">{entry.artist}</td>
                <td className="px-6 py-4">{entry.song_title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${entry.starting_contest === 'final' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {entry.starting_contest === 'semi1' ? 'Semi-final 1' : entry.starting_contest === 'semi2' ? 'Semi-final 2' : 'Final'}
                  </span>
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <button onClick={() => handleEdit(entry)} className="text-primary hover:underline">Edit</button>
                  <button onClick={() => onDelete(entry.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
