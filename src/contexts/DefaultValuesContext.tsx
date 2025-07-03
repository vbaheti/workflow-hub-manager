
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DefaultValuesContextType {
  defaultProject: string;
  defaultState: string;
  defaultRole: string;
  companyName: string;
  financialYearStart: string;
  loading: boolean;
}

const DefaultValuesContext = createContext<DefaultValuesContextType | undefined>(undefined);

export const DefaultValuesProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState({
    defaultProject: 'mumbai-financial',
    defaultState: 'Maharashtra',
    defaultRole: 'manager',
    companyName: 'Aegis ERP',
    financialYearStart: '2024-04-01'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('key, value')
          .in('key', ['default_project', 'default_state', 'default_role', 'company_name', 'financial_year_start']);

        if (error) {
          console.error('Error fetching settings:', error);
          return;
        }

        const settingsMap = data.reduce((acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {} as Record<string, any>);

        setSettings({
          defaultProject: settingsMap.default_project || 'mumbai-financial',
          defaultState: settingsMap.default_state || 'Maharashtra',
          defaultRole: settingsMap.default_role || 'manager',
          companyName: settingsMap.company_name || 'Aegis ERP',
          financialYearStart: settingsMap.financial_year_start || '2024-04-01'
        });
      } catch (error) {
        console.error('Error in fetchSettings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const value = {
    ...settings,
    loading
  };

  return (
    <DefaultValuesContext.Provider value={value}>
      {children}
    </DefaultValuesContext.Provider>
  );
};

export const useDefaultValues = () => {
  const context = useContext(DefaultValuesContext);
  if (context === undefined) {
    throw new Error('useDefaultValues must be used within a DefaultValuesProvider');
  }
  return context;
};
