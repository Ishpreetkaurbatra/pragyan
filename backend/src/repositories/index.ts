import { IRepository } from './repository.interface';
import { InMemoryRepository } from './in-memory.repository';

let repositoryInstance: IRepository | null = null;

export function getRepository(): IRepository {
  if (!repositoryInstance) {
    // In default DEMO mode or development without PostgreSQL connection,
    // use the rich seeded InMemoryRepository.
    repositoryInstance = new InMemoryRepository();
  }
  return repositoryInstance;
}
