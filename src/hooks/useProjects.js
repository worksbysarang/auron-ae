// ============================================================
// AURON.AE — useProjects hook
// Fetches projects from Supabase if configured,
// otherwise falls back to the local data file.
// ============================================================

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import { projects as localProjects } from '../data/projects';

export function useProjects({ adminMode = false } = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        if (isSupabaseConfigured) {
          let query = supabase
            .from('projects')
            .select('*')
            .order('sort_order', { ascending: true });

          if (!adminMode) {
            query = query.eq('status', 'published');
          }

          const { data, error: sbError } = await query;
          if (sbError) throw sbError;
          setProjects(data || []);
        } else {
          // Local fallback
          const visible = adminMode
            ? localProjects
            : localProjects.filter(p => p.visible && p.status !== 'draft');
          setProjects(visible);
        }
      } catch (err) {
        console.error('useProjects error:', err);
        setError(err);
        // Fallback to local data on error
        setProjects(localProjects.filter(p => p.visible));
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [adminMode]);

  return { projects, loading, error };
}

