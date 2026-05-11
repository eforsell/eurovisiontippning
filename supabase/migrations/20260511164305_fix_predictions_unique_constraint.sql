-- T028: Fix unique constraint on predictions to include type
ALTER TABLE public.predictions DROP CONSTRAINT IF EXISTS predictions_user_id_entry_id_key;
ALTER TABLE public.predictions ADD CONSTRAINT predictions_user_id_entry_id_type_key UNIQUE(user_id, entry_id, type);
