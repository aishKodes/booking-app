export type ReservationStatus =
  "confirmed" | "arriving" | "seated" | "completed" | "cancelled" | "no-show";
export type Seating = "No preference" | "Main dining" | "Window" | "Terrace" | "Private dining";
export interface Reservation {
  id: string;
  confirmationCode: string;
  guestId: string;
  guestName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  seatingPreference: Seating;
  occasion: string;
  specialRequests: string;
  tableId: string | null;
  status: ReservationStatus;
  source: "Website" | "Mobile App" | "Phone" | "Walk-in";
  createdAt: string;
  updatedAt: string;
  customerBooking: boolean;
}
export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  notes: string;
  favoriteTable: string;
}
export interface DiningTable {
  id: string;
  number: number;
  capacity: number;
  section: Seating;
  x: number;
  y: number;
  shape: "round" | "rect";
  turnover: boolean;
}
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  dietary: "Vegetarian" | "Vegan" | "Non-vegetarian";
  glutenFree: boolean;
  spicy: boolean;
  allergens: string;
  image?: string;
  featured: boolean;
  available: boolean;
}
export interface Activity {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
}
export interface Settings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  lunchOpen: string;
  lunchClose: string;
  dinnerOpen: string;
  dinnerClose: string;
  bookingWindow: number;
  minimumNotice: number;
  maxPartySize: number;
  duration: number;
  gracePeriod: number;
  emailNotifications: boolean;
  bookingAlerts: boolean;
}
export interface DemoState {
  version: number;
  reservations: Reservation[];
  guests: Guest[];
  tables: DiningTable[];
  menu: MenuItem[];
  activities: Activity[];
  settings: Settings;
  guestApp: GuestAppState;
}
export interface GuestAppState {
  profile: {
    name: string;
    email: string;
    phone: string;
    dietary: string;
    seating: Seating;
    notifications: boolean;
  };
  favoriteDishes: string[];
  favoriteExperiences: string[];
  readNotifications: string[];
}
export type BookingInput = Pick<
  Reservation,
  | "guestName"
  | "email"
  | "phone"
  | "date"
  | "time"
  | "partySize"
  | "seatingPreference"
  | "occasion"
  | "specialRequests"
>;
