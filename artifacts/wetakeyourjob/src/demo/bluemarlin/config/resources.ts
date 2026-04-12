import kleinImg from '@assets/stock_images/klein_curacao_catamaran.jpg';
import snorkelImg from '@assets/stock_images/snorkeling_trip.jpg';
import beachImg from '@assets/stock_images/west_coast_beach.jpg';
import sunsetImg from '@assets/stock_images/sunset_cruise.jpg';
import jetskiImg from '@assets/stock_images/jetski_excursion.jpg';

export const BOAT_RESOURCES = [
  {
    id: 'bluemarlin.catamaran.44ft@group.calendar.google.com',
    name: 'BlueMarlin Catamaran (44 ft)',
    capacity: 45
  },
  {
    id: 'bluemarlin.catamaran2.40ft@group.calendar.google.com',
    name: 'BlueMarlin II Catamaran (40 ft)',
    capacity: 35
  },
  {
    id: 'bluemarlin.jetski@group.calendar.google.com',
    name: 'Kawasaki Jet Ski (160 HP)',
    capacity: 2
  }
];

export const TRIP_PACKAGES = [
  {
    id: 'klein-curacao',
    name: 'Klein Curaçao Trip',
    price: 140,
    priceKids: 75,
    duration: '8.5 hours',
    schedule: 'Daily',
    departure: '8:00 AM & 8:30 AM',
    location: 'Jan Thiel Beach',
    description: 'Sail to the uninhabited island of Klein Curaçao with its pearl white beach, crystal clear waters, and iconic pink lighthouse. Swim, snorkel, or simply relax on this paradise island.',
    includes: ['Premium bar', 'BBQ lunch', 'Snorkel & mask', 'Captain\'s Happy Hour'],
    image: kleinImg
  },
  {
    id: 'snorkeling-trip',
    name: 'Snorkeling Trip',
    price: 110,
    priceKids: 55,
    duration: '5 hours',
    schedule: 'Every Friday',
    departure: '10:00 AM',
    location: 'Mood Beach, Mambo Blvd',
    description: 'Discover the underwater world of Curaçao! Visit 3 spectacular snorkel sites including the famous Tugboat wreck in Caracas Bay, surrounded by colorful fish and coral.',
    includes: ['Open bar', 'Light lunch', 'Snorkel & mask', '3 snorkel spots'],
    image: snorkelImg
  },
  {
    id: 'west-coast-beach',
    name: 'Best of West Beach Trip',
    price: 140,
    priceKids: 75,
    duration: '8 hours',
    schedule: 'Sunday & Wednesday',
    departure: '9:00 AM',
    location: 'Mood Beach / Piscadera Bay',
    description: 'Cruise the west coast to Cas Abao Beach — one of the top 5 most beautiful beaches in the world. Pearl white sand, palm trees, and crystal clear water await you.',
    includes: ['Premium bar', 'BBQ lunch', 'Snorkel & mask', 'Kokomo Beach stop'],
    image: beachImg
  },
  {
    id: 'sunset-cruise',
    name: 'Sunset Cruise',
    price: 79,
    priceKids: 40,
    duration: '2.5 hours',
    schedule: 'Tue, Thu, Fri & Sat',
    departure: '5:30 PM',
    location: 'Mood Beach, Mambo Blvd',
    description: 'Cruise the Curaçao east coast, Caracas Bay, and Spanish Water waterfront while enjoying drinks, bites, and music as you watch the Caribbean sunset.',
    includes: ['Premium bar', 'Bites & snacks', 'Live music', 'Sunset views'],
    image: sunsetImg
  },
  {
    id: 'jet-ski-excursion',
    name: 'Jet Ski Excursion',
    price: 135,
    priceKids: null,
    duration: '1 hour',
    schedule: 'Daily',
    departure: 'Every hour',
    location: 'Spanish Water / Piscadera Bay',
    description: 'Hop on a powerful 160 HP Kawasaki Jet Ski and zip across crystal-clear waters. A guided tour with stunning coastline views — no experience needed!',
    includes: ['Jet Ski rental', 'Life jacket', 'Guided tour', 'Safety briefing'],
    image: jetskiImg
  }
];
