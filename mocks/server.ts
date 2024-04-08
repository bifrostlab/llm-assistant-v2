import { setupServer } from 'msw/node';
import { handlers } from './handlers/pdf';

export const server = setupServer(...handlers);
