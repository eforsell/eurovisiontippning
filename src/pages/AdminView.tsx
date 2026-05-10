import { useState, useEffect } from 'react';
import { TabNavigation } from '../components/Admin/TabNavigation';
import { MetadataForm } from '../components/Admin/MetadataForm';
import { EntryManager } from '../components/Admin/EntryManager';
import { ProgressionManager } from '../components/Admin/ProgressionManager';
import { FinalRankingManager } from '../components/Admin/FinalRankingManager';
import { Database } from '../types/database.types';
import { supabase } from '../lib/supabase';
import { adminService } from '../services/adminService';

type Year = Database['public']['Tables']['years']['Row'];
type Entry = Database['public']['Tables']['entries']['Row'];

export const AdminView = () => {
  const [activeTab, setActiveTab] = useState('metadata');
  
  const [yearData, setYearData] = useState<Year | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [semi1Progressed, setSemi1Progressed] = useState<string[]>([]);
  const [semi2Progressed, setSemi2Progressed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // For simplicity in this demo, fetch the first year found
      const { data: yearRes } = await supabase.from('years').select('*').limit(1).single();
      if (yearRes) {
        setYearData(yearRes);
        
        const { data: entriesRes } = await supabase.from('entries').select('*').eq('year_id', yearRes.id).order('start_position', { ascending: true });
        if (entriesRes) setEntries(entriesRes);
        
        const { data: resultsRes } = await supabase.from('results').select('*').eq('year_id', yearRes.id);
        if (resultsRes) {
          setSemi1Progressed(resultsRes.filter(r => r.is_semi1_qualifier).map(r => r.entry_id));
          setSemi2Progressed(resultsRes.filter(r => r.is_semi2_qualifier).map(r => r.entry_id));
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleMetadataSave = async (data: Partial<Year>) => {
    if (!yearData) return;
    const { data: updated, error } = await supabase.from('years').update(data).eq('id', yearData.id).select().single();
    if (updated) {
      setYearData(updated);
      alert('Metadata saved!');
    } else if (error) {
      alert(`Error saving metadata: ${error.message}`);
    }
  };

  const handleEntrySave = async (entry: Partial<Entry>) => {
    if (!yearData) return;

    if (entry.start_position !== null) {
      const isDuplicate = entries.some(
        (e) => e.starting_contest === entry.starting_contest &&
               e.start_position === entry.start_position &&
               e.id !== entry.id
      );
      if (isDuplicate) {
        alert(`Start order ${entry.start_position} is already in use for ${entry.starting_contest}. Start orders must be unique.`);
        return;
      }
    }

    if (entry.id) {
      const oldEntry = entries.find(e => e.id === entry.id);
      
      if (oldEntry && oldEntry.starting_contest !== entry.starting_contest) {
        if (oldEntry.starting_contest === 'semi1' && semi1Progressed.includes(entry.id)) {
           setSemi1Progressed(prev => prev.filter(id => id !== entry.id));
           const newTarget = Math.max(1, yearData.semi1_progression_target - 1);
           setYearData(prev => prev ? { ...prev, semi1_progression_target: newTarget } : null);
           await supabase.from('years').update({ semi1_progression_target: newTarget }).eq('id', yearData.id);
           await supabase.from('results').update({ is_semi1_qualifier: false }).eq('entry_id', entry.id);
        }
        if (oldEntry.starting_contest === 'semi2' && semi2Progressed.includes(entry.id)) {
           setSemi2Progressed(prev => prev.filter(id => id !== entry.id));
           const newTarget = Math.max(1, yearData.semi2_progression_target - 1);
           setYearData(prev => prev ? { ...prev, semi2_progression_target: newTarget } : null);
           await supabase.from('years').update({ semi2_progression_target: newTarget }).eq('id', yearData.id);
           await supabase.from('results').update({ is_semi2_qualifier: false }).eq('entry_id', entry.id);
        }
      }
      
      const { data: updated } = await supabase.from('entries').update(entry).eq('id', entry.id).select().single();
      if (updated) setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
    } else {
      const { data: inserted } = await supabase.from('entries').insert({ ...entry, year_id: yearData.id } as Entry).select().single();
      if (inserted) setEntries(prev => [...prev, inserted]);
    }
  };

  const handleEntryDelete = async (id: string) => {
    await supabase.from('entries').delete().eq('id', id);
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleImport = async (jsonData: Record<string, unknown>[]) => {
    if (!yearData) return;
    const { success, error } = await adminService.importEntriesFromJson(jsonData, yearData.id);
    if (success) {
      const { data: entriesRes } = await supabase.from('entries').select('*').eq('year_id', yearData.id).order('start_position', { ascending: true });
      if (entriesRes) setEntries(entriesRes);
      alert('Import successful!');
    } else {
      alert(`Import failed: ${error?.message}`);
    }
  };

  const handleSemi1ProgressionSave = async (progressedIds: string[]) => {
    if (!yearData) return;
    setSemi1Progressed(progressedIds);
    setYearData(prev => prev ? { ...prev, semi1_completed: true } : null);
    
    await supabase.from('years').update({ semi1_completed: true }).eq('id', yearData.id);
    
    // Reset all semi1 entries first
    const semi1Entries = entries.filter(e => e.starting_contest === 'semi1').map(e => e.id);
    for (const entryId of semi1Entries) {
      await supabase.from('results').upsert({ year_id: yearData.id, entry_id: entryId, is_semi1_qualifier: progressedIds.includes(entryId) }, { onConflict: 'year_id, entry_id' });
    }
    
    alert('Semi 1 progression saved!');
  };

  const handleSemi2ProgressionSave = async (progressedIds: string[]) => {
    if (!yearData) return;
    setSemi2Progressed(progressedIds);
    setYearData(prev => prev ? { ...prev, semi2_completed: true } : null);
    
    await supabase.from('years').update({ semi2_completed: true }).eq('id', yearData.id);
    
    // Reset all semi2 entries first
    const semi2Entries = entries.filter(e => e.starting_contest === 'semi2').map(e => e.id);
    for (const entryId of semi2Entries) {
      await supabase.from('results').upsert({ year_id: yearData.id, entry_id: entryId, is_semi2_qualifier: progressedIds.includes(entryId) }, { onConflict: 'year_id, entry_id' });
    }
    
    alert('Semi 2 progression saved!');
  };

  const handleFinalRankingSave = async (ranking: { entryId: string; rank: number }[]) => {
     if (!yearData) return;
     for (const r of ranking) {
       await supabase.from('results').upsert({ year_id: yearData.id, entry_id: r.entryId, final_rank: r.rank }, { onConflict: 'year_id, entry_id' });
     }
     alert('Final ranking saved!');
  };

  if (loading || !yearData) return <div className="p-8 text-center">Loading admin data...</div>;

  const tabs = [
    { id: 'metadata', label: 'Event Metadata' },
    { id: 'entries', label: 'Manage Entries' },
    { id: 'semi1', label: 'Semi-final 1 Progression' },
    { id: 'semi2', label: 'Semi-final 2 Progression' },
    { 
      id: 'final', 
      label: 'Final Ranking', 
      locked: !(yearData.semi1_completed && yearData.semi2_completed),
      lockedMessage: 'Both semi-finals must be completed to unlock the final ranking.'
    }
  ];

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Event Administration</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <div className="p-6">
          {activeTab === 'metadata' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Event Configuration</h2>
              <MetadataForm 
                initialData={yearData} 
                onSave={handleMetadataSave} 
                currentProgressed={{ semi1: semi1Progressed.length, semi2: semi2Progressed.length }}
              />
            </div>
          )}
          
          {activeTab === 'entries' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Manage Entries</h2>
              <EntryManager 
                entries={entries} 
                onSave={handleEntrySave} 
                onDelete={handleEntryDelete} 
                onImport={handleImport}
              />
            </div>
          )}
          
          {activeTab === 'semi1' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Semi-final 1 Progression</h2>
              <ProgressionManager
                contest="semi1"
                entries={entries}
                targetCount={yearData.semi1_progression_target}
                initialProgressedIds={semi1Progressed}
                onSave={handleSemi1ProgressionSave}
              />
            </div>
          )}
          
          {activeTab === 'semi2' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Semi-final 2 Progression</h2>
              <ProgressionManager
                contest="semi2"
                entries={entries}
                targetCount={yearData.semi2_progression_target}
                initialProgressedIds={semi2Progressed}
                onSave={handleSemi2ProgressionSave}
              />
            </div>
          )}
          
          {activeTab === 'final' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Grand Final Ranking</h2>
              <FinalRankingManager
                entries={entries}
                semi1ProgressedIds={semi1Progressed}
                semi2ProgressedIds={semi2Progressed}
                onSave={handleFinalRankingSave}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
