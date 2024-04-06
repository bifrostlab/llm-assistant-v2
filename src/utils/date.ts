import { getUnixTime } from 'date-fns';

export function getCurrentUnixTime() {
  return getUnixTime(new Date());
}
