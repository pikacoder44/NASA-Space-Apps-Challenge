'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { MissionOverview, DailyCheckInInput, SaveResult, SyncState } from '../types/health';
import { getHealthRepository, HealthRepository } from '../services';
import { DemoScenarioKey } from '../services/demoHealthRepository';

interface HealthContextValue {
  overview: MissionOverview | null;
  loading: boolean;
  error: string | null;
  activeScenario: DemoScenarioKey;
  setScenario: (scenario: DemoScenarioKey) => Promise<void>;
  refreshOverview: () => Promise<void>;
  submitCheckIn: (input: DailyCheckInInput) => Promise<SaveResult>;
  triggerSync: () => Promise<void>;
  syncState: SyncState | null;
  repository: HealthRepository;
}

const HealthContext = createContext<HealthContextValue | undefined>(undefined);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [repository] = useState<HealthRepository>(() => getHealthRepository());
  const [overview, setOverview] = useState<MissionOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeScenario, setActiveScenarioState] = useState<DemoScenarioKey>('day90_yellow');
  const [syncState, setSyncState] = useState<SyncState | null>(null);

  const refreshOverview = useCallback(async () => {
    try {
      setError(null);
      const data = await repository.getMissionOverview();
      setOverview(data);
      setSyncState(data.sync);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load mission telemetry';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    let isMounted = true;
    repository.getMissionOverview().then((data) => {
      if (isMounted) {
        setOverview(data);
        setSyncState(data.sync);
        setLoading(false);
      }
    }).catch((err) => {
      if (isMounted) {
        setError(err instanceof Error ? err.message : 'Failed to load mission telemetry');
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [repository]);

  const setScenario = async (scenario: DemoScenarioKey) => {
    try {
      setLoading(true);
      const updated = await repository.switchDemoScenario(scenario);
      setActiveScenarioState(scenario);
      setOverview(updated);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to switch scenario';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const submitCheckIn = async (input: DailyCheckInInput): Promise<SaveResult> => {
    const res = await repository.submitDailyCheckIn(input);
    await refreshOverview();
    return res;
  };

  const triggerSync = async () => {
    if (overview) {
      setSyncState((prev) => prev ? { ...prev, queueState: 'syncing' } : null);
    }
    const updatedSync = await repository.triggerSyncSimulation();
    setSyncState(updatedSync);
    await refreshOverview();
  };

  return (
    <HealthContext.Provider
      value={{
        overview,
        loading,
        error,
        activeScenario,
        setScenario,
        refreshOverview,
        submitCheckIn,
        triggerSync,
        syncState,
        repository
      }}
    >
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const ctx = useContext(HealthContext);
  if (!ctx) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return ctx;
}
