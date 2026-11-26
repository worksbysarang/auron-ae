import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import { siteConfig as localConfig } from '../data/siteConfig';

const SiteConfigContext = createContext({
  config: localConfig,
  loading: false,
  refresh: async () => {},
});

function mergeConfig(base, remote) {
  if (!remote || typeof remote !== 'object') return base;
  return {
    ...base,
    ...remote,
    socials: { ...base.socials, ...(remote.socials || {}) },
    services: Array.isArray(remote.services) ? remote.services : base.services,
    featuredProjectIds: Array.isArray(remote.featuredProjectIds)
      ? remote.featuredProjectIds
      : base.featuredProjectIds,
  };
}

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(localConfig);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  async function load() {
    if (!isSupabaseConfigured) {
      setConfig(localConfig);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'config')
        .maybeSingle();

      if (error) throw error;
      setConfig(mergeConfig(localConfig, data?.value));
    } catch (err) {
      console.error('useSiteConfig error:', err);
      setConfig(localConfig);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, loading, refresh: load }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
