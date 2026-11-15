import { HealthRepository } from './healthRepository';
import { DemoHealthRepository } from './demoHealthRepository';
import { ApiHealthRepository } from './apiHealthRepository';

let repositoryInstance: HealthRepository | null = null;

export function getHealthRepository(): HealthRepository {
  if (!repositoryInstance) {
    const useApi = process.env.NEXT_PUBLIC_USE_API === 'true';
    repositoryInstance = useApi ? new ApiHealthRepository() : new DemoHealthRepository();
  }
  return repositoryInstance;
}

export { DemoHealthRepository } from './demoHealthRepository';
export { ApiHealthRepository } from './apiHealthRepository';
export type { HealthRepository } from './healthRepository';
