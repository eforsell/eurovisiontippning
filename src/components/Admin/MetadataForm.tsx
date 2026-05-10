import { FC, useState } from 'react';
import { Database } from '../../types/database.types';

type Year = Database['public']['Tables']['years']['Row'];

interface MetadataFormProps {
  initialData: Year;
  currentProgressed: { semi1: number; semi2: number };
  onSave: (data: Partial<Year>) => void;
}

export const MetadataForm: FC<MetadataFormProps> = ({ initialData, currentProgressed, onSave }) => {
  const [formData, setFormData] = useState<Year>(initialData);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.semi1_progression_target < currentProgressed.semi1) {
      setError(`Semi-final 1: Cannot reduce target below current progressed count (${currentProgressed.semi1})`);
      return;
    }

    if (formData.semi2_progression_target < currentProgressed.semi2) {
      setError(`Semi-final 2: Cannot reduce target below current progressed count (${currentProgressed.semi2})`);
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Year</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="semi1_start" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Semi-final 1 Start</label>
          <input
            type="datetime-local"
            id="semi1_start"
            name="semi1_start"
            value={formData.semi1_start.slice(0, 16)} // Simplified for input
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="semi2_start" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Semi-final 2 Start</label>
          <input
            type="datetime-local"
            id="semi2_start"
            name="semi2_start"
            value={formData.semi2_start.slice(0, 16)}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="final_start" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Grand Final Start</label>
          <input
            type="datetime-local"
            id="final_start"
            name="final_start"
            value={formData.final_start.slice(0, 16)}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="semi1_progression_target" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Semi-final 1 Target</label>
          <input
            type="number"
            id="semi1_progression_target"
            name="semi1_progression_target"
            value={formData.semi1_progression_target}
            onChange={handleChange}
            min="1"
            className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="semi2_progression_target" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Semi-final 2 Target</label>
          <input
            type="number"
            id="semi2_progression_target"
            name="semi2_progression_target"
            value={formData.semi2_progression_target}
            onChange={handleChange}
            min="1"
            className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="logo_url" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Logo URL</label>
          <input
            type="text"
            id="logo_url"
            name="logo_url"
            value={formData.logo_url || ''}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="/logo.png or https://..."
          />
        </div>
      </div>

      <button
        type="submit"
        className="text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary-dark dark:focus:ring-primary-800"
      >
        Save Metadata
      </button>
    </form>
  );
};
