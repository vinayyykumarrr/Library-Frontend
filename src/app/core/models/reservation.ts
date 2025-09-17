
import { Book } from './book';
import { User } from './user';
export type ReservationStatus = 'ACTIVE' | 'RETURNED';
export interface Reservation {
  id: number;
  users: User;
  books: Book;
  issue_date: string;
  return_date: string;
  status: ReservationStatus;
}
