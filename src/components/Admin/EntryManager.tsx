import { FC, useState, useRef, useMemo } from 'react';
import { Database } from '../../types/database.types';

type Entry = Database['public']['Tables']['entries']['Row'];
type SortField = 'start_position' | 'country' | 'artist' | 'song_title' | 'starting_contest';

interface EntryManagerProps {
  entries: Entry[];
  onSave: (entry: Partial<Entry>) => void;
  onDelete: (id: string) => void;
  onImport: (jsonData: Record<string, unknown>[]) => Promise<void>;
}

export const EntryManager: FC<EntryManagerProps> = ({ entries, onSave, onDelete, onImport }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');

  const [sortField, setSortField] = useState<SortField>('country');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [editingEntry, setEditingEntry] = useState<Partial<Entry>>({
    country: '',
    artist: '',
    song_title: '',
    start_position: 1,
    starting_contest: 'semi1'
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      // Handle null values in start_position
      if (aValue === null) aValue = sortDirection === 'asc' ? Infinity : -Infinity;
      if (bValue === null) bValue = sortDirection === 'asc' ? Infinity : -Infinity;

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [entries, sortField, sortDirection]);

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setIsEditing(true);
    setShowImport(false);
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
    setShowImport(false);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!Array.isArray(json)) {
        throw new Error("JSON must be an array of entries.");
      }

      // Basic validation against schema
      for (let i = 0; i < json.length; i++) {
        const item = json[i];
        if (!item.country || !item.artist || !item.song_title || !item.starting_contest || (item.start_position !== null && typeof item.start_position !== 'number')) {
          throw new Error(`Entry at index ${i} is missing required fields or has invalid types.`);
        }
      }

      if (window.confirm("WARNING: Importing from JSON will replace ALL existing entries and delete all user bets. This is destructive and cannot be undone. Are you sure?")) {
        setImporting(true);
        await onImport(json);
        setImporting(false);
        setShowImport(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to parse JSON.";
      setImportError(errorMessage);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Entries</h3>
        <div>
          <button
            onClick={() => {
              setShowImport(!showImport);
              setIsEditing(false);
            }}
            className="text-white bg-secondary hover:bg-secondary/90 font-medium rounded-lg text-sm px-4 py-2 mr-2"
          >
            Import JSON
          </button>
          <button
            onClick={handleAddNew}
            className="text-white bg-primary hover:bg-primary-dark font-medium rounded-lg text-sm px-4 py-2"
          >
            Add Entry
          </button>
        </div>
      </div>

      {showImport && (
        <div className="bg-muted/20 p-4 rounded-lg mb-6 border border-border">
          <h4 className="font-semibold mb-2">Import Entries from JSON</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Upload a JSON file to batch import entries. <strong className="text-destructive">This will overwrite all existing entries and user bets.</strong>
            <br/><br/>
            <strong>Expected JSON Schema:</strong>
            <br/>
            <code>
              {`[
  {
    "country": "string",
    "artist": "string",
    "song_title": "string",
    "starting_contest": "semi1" | "semi2" | "final",
    "start_position": number,
    "youtube_id": "string" | null
  }
]`}
            </code>
          </p>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef}
            onChange={handleFileChange} 
            disabled={importing}
            className="block w-full text-sm text-foreground border border-input rounded-md cursor-pointer bg-background focus:outline-none"
          />
          {importing && <p className="text-sm text-primary mt-2">Importing...</p>}
          {importError && <p className="text-sm text-destructive mt-2">{importError}</p>}
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_position" className="block text-sm font-medium">Start Position</label>
              <input type="number" id="start_position" name="start_position" value={editingEntry.start_position ?? ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="Leave empty for unassigned" />
            </div>
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
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('start_position')}>
                Start <SortIcon field="start_position" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('country')}>
                Country <SortIcon field="country" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('artist')}>
                Artist <SortIcon field="artist" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('song_title')}>
                Song <SortIcon field="song_title" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('starting_contest')}>
                Contest <SortIcon field="starting_contest" sortField={sortField} sortDirection={sortDirection} />
              </th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry) => (
              <tr key={entry.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">{entry.start_position !== null ? entry.start_position : '-'}</td>
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
