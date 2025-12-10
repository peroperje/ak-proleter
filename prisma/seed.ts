import { PrismaClient, UnitType, DisciplineCategory, MeasurementUnit } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as fs from 'fs';
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Define the type for the athlete data from JSON
interface AthleteData {
  openTrackId: string;
  fullName: string;
  yearOfBirth: string;
  category: string;
  licenseNumber: string;
  expirationDate: string;
  lastCompetitionDate: string | null;
}

// Function to parse date from format "DD.MM.YYYY." to a Date object
function parseDate(dateString: string): Date | null {
  if (!dateString) return null;

  // Remove the trailing dot if present
  const cleanDateString = dateString.endsWith('.') ? dateString.slice(0, -1) : dateString;

  // Split the date parts
  const parts = cleanDateString.split('.');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}

// Function to determine gender based on name
function determineGender(fullName: string): string {
  // List of common female first names in Serbian
  const femaleNames = [
    'ana', 'milica', 'jelena', 'marija', 'jovana', 'katarina', 'teodora', 'aleksandra', 'sara',
    'anđela', 'andrea', 'tamara', 'kristina', 'ivana', 'sofija', 'nataša', 'maja', 'nina',
    'valentina', 'tijana', 'nevena', 'marina', 'danica', 'sanja', 'dragana', 'angela', 'petra',
    'emilija', 'anastasija', 'iva', 'maša', 'lena', 'una', 'elena', 'dijana', 'gordana', 'luna',
    'simeona', 'zorka', 'nađa', 'tea'
  ];

  // Extract first name (assuming first word is the first name)
  const firstName = fullName.split(' ')[0].toLowerCase();

  // Check if the name is in the list of female names
  return femaleNames.includes(firstName) ? 'female' : 'male';
}

// Function to get a gender-appropriate avatar image from the avatars directory
function getRandomAvatar(gender: string): string {
  const avatarsDir = '/home/petar/Projects/ak-proleter/public/avatars-img';
  const avatarFiles = fs.readdirSync(avatarsDir);

  if (avatarFiles.length === 0) {
    return ''; // Return empty string if no avatars found
  }

  // Filter avatars based on gender
  const genderFilter = gender === 'female' ? 'female' : 'male';
  const filteredAvatars = avatarFiles.filter(file => file.toLowerCase().includes(genderFilter));

  // If no matching avatars found, fall back to all avatars
  const availableAvatars = filteredAvatars.length > 0 ? filteredAvatars : avatarFiles;

  const randomIndex = Math.floor(Math.random() * availableAvatars.length);
  const randomAvatar = availableAvatars[randomIndex];

  // Return the path relative to the public directory
  return `/avatars-img/${randomAvatar}`;
}

// Function to seed discipline categories
async function seedDisciplineCategories(): Promise<DisciplineCategory[]> {
  console.log('Seeding discipline categories...');

  const categories = [
    { name: 'Sprints', description: 'Short distance running events' },
    { name: 'Middle Distance', description: 'Medium distance running events' },
    { name: 'Long Distance', description: 'Long distance running events' },
    { name: 'Hurdles', description: 'Running events with barriers' },
    { name: 'Relays', description: 'Team running events' },
    { name: 'Jumps', description: 'Athletic jumping events' },
    { name: 'Throws', description: 'Athletic throwing events' },
    { name: 'Combined Events', description: 'Multi-event competitions' },
    { name: 'Race Walking', description: 'Walking events' },
    { name: 'Road Running', description: 'Long distance running on roads' },
    { name: 'Cross Country', description: 'Running over natural terrain' }
  ];

  const results = [];
  for (const category of categories) {
    const result = await prisma.disciplineCategory.upsert({
      where: { name: category.name },
      update: { description: category.description },
      create: {
        name: category.name,
        description: category.description
      }
    });
    results.push(result);
  }

  console.log(`${results.length} discipline categories created or updated`);
  return results;
}

// Function to seed measurement units
async function seedMeasurementUnits(): Promise<MeasurementUnit[]> {
  console.log('Seeding measurement units...');

  const units = [
    { name: 'seconds', symbol: 's', type: UnitType.TIME },
    { name: 'minutes', symbol: 'min', type: UnitType.TIME },
    { name: 'hours', symbol: 'h', type: UnitType.TIME },
    { name: 'meters', symbol: 'm', type: UnitType.DISTANCE },
    { name: 'kilometers', symbol: 'km', type: UnitType.DISTANCE },
    { name: 'points', symbol: 'pts', type: UnitType.POINTS },
    { name: 'count', symbol: 'cnt', type: UnitType.COUNT },
    { name: 'kilograms', symbol: 'kg', type: UnitType.WEIGHT },
    { name: 'centimeters', symbol: 'cm', type: UnitType.DISTANCE },
    { name: 'milliseconds', symbol: 'ms', type: UnitType.TIME }
  ];

  const results = [];
  for (const unit of units) {
    const result = await prisma.measurementUnit.upsert({
      where: { name: unit.name },
      update: {
        symbol: unit.symbol,
        type: unit.type
      },
      create: {
        name: unit.name,
        symbol: unit.symbol,
        type: unit.type
      }
    });
    results.push(result);
  }

  console.log(`${results.length} measurement units created or updated`);
  return results;
}

// Function to seed disciplines
async function seedDisciplines(categories: DisciplineCategory[], units: MeasurementUnit[]) {
  console.log('Seeding disciplines...');

  // Create maps for easier lookup
  const categoryMap = new Map(categories.map(cat => [cat.name, cat.id]));
  const unitMap = new Map(units.map(unit => [unit.name, unit.id]));

  const disciplines = [
    // Sprints
    {
      name: '100 meters',
      internationalSign: '100m',
      description: 'Sprint race over 100 meters',
      categoryName: 'Sprints',
      unitName: 'seconds',
      isTrackEvent: true,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },
    {
      name: '200 meters',
      internationalSign: '200m',
      description: 'Sprint race over 200 meters',
      categoryName: 'Sprints',
      unitName: 'seconds',
      isTrackEvent: true,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },
    {
      name: '400 meters',
      internationalSign: '400m',
      description: 'Sprint race over 400 meters',
      categoryName: 'Sprints',
      unitName: 'seconds',
      isTrackEvent: true,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },

    // Middle Distance
    {
      name: '800 meters',
      internationalSign: '800m',
      description: 'Middle distance race over 800 meters',
      categoryName: 'Middle Distance',
      unitName: 'seconds',
      isTrackEvent: true,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },
    {
      name: '1500 meters',
      internationalSign: '1500m',
      description: 'Middle distance race over 1500 meters',
      categoryName: 'Middle Distance',
      unitName: 'seconds',
      isTrackEvent: true,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },

    // Long Distance
    {
      name: '5000 meters',
      internationalSign: '5000m',
      description: 'Long distance race over 5000 meters',
      categoryName: 'Long Distance',
      unitName: 'seconds',
      isTrackEvent: true,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },
    {
      name: '10000 meters',
      internationalSign: '10000m',
      description: 'Long distance race over 10000 meters',
      categoryName: 'Long Distance',
      unitName: 'seconds',
      isTrackEvent: true,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },

    // Hurdles
    {
      name: '110 meters hurdles',
      internationalSign: '110mH',
      description: 'Hurdle race over 110 meters for men',
      categoryName: 'Hurdles',
      unitName: 'seconds',
      isTrackEvent: true,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: false,
      worldChampionshipEvent: true
    },
    {
      name: '400 meters hurdles',
      internationalSign: '400mH',
      description: 'Hurdle race over 400 meters',
      categoryName: 'Hurdles',
      unitName: 'seconds',
      isTrackEvent: true,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },
    {
      name: '100 meters hurdles',
      internationalSign: '100mH',
      description: 'Hurdle race over 100 meters for women',
      categoryName: 'Hurdles',
      unitName: 'seconds',
      isTrackEvent: true,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: false,
      worldChampionshipEvent: true
    },

    // Relays
    {
      name: '4x100 meters relay',
      internationalSign: '4x100m',
      description: 'Team relay race with 4 runners each running 100 meters',
      categoryName: 'Relays',
      unitName: 'seconds',
      isTrackEvent: true,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: true,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },
    {
      name: '4x400 meters relay',
      internationalSign: '4x400m',
      description: 'Team relay race with 4 runners each running 400 meters',
      categoryName: 'Relays',
      unitName: 'seconds',
      isTrackEvent: true,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: true,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },

    // Jumps
    {
      name: 'High Jump',
      internationalSign: 'HJ',
      description: 'Athletic jump for height over a horizontal bar',
      categoryName: 'Jumps',
      unitName: 'centimeters',
      isTrackEvent: false,
      isFieldEvent: true,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },
    {
      name: 'Pole Vault',
      internationalSign: 'PV',
      description: 'Athletic jump for height over a horizontal bar using a flexible pole',
      categoryName: 'Jumps',
      unitName: 'centimeters',
      isTrackEvent: false,
      isFieldEvent: true,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },
    {
      name: 'Long Jump',
      internationalSign: 'LJ',
      description: 'Athletic jump for distance from a take-off point',
      categoryName: 'Jumps',
      unitName: 'meters',
      isTrackEvent: false,
      isFieldEvent: true,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },
    {
      name: 'Triple Jump',
      internationalSign: 'TJ',
      description: 'Athletic jump consisting of hop, step and jump phases',
      categoryName: 'Jumps',
      unitName: 'meters',
      isTrackEvent: false,
      isFieldEvent: true,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },

    // Throws
    {
      name: 'Shot Put',
      internationalSign: 'SP',
      description: 'Throwing a heavy spherical object as far as possible',
      categoryName: 'Throws',
      unitName: 'meters',
      isTrackEvent: false,
      isFieldEvent: true,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },
    {
      name: 'Discus Throw',
      internationalSign: 'DT',
      description: 'Throwing a heavy disc as far as possible',
      categoryName: 'Throws',
      unitName: 'meters',
      isTrackEvent: false,
      isFieldEvent: true,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },
    {
      name: 'Hammer Throw',
      internationalSign: 'HT',
      description: 'Throwing a heavy metal ball attached to wire as far as possible',
      categoryName: 'Throws',
      unitName: 'meters',
      isTrackEvent: false,
      isFieldEvent: true,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },
    {
      name: 'Javelin Throw',
      internationalSign: 'JT',
      description: 'Throwing a spear-like implement as far as possible',
      categoryName: 'Throws',
      unitName: 'meters',
      isTrackEvent: false,
      isFieldEvent: true,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },

    // Combined Events
    {
      name: 'Decathlon',
      internationalSign: 'DEC',
      description: 'Combined event consisting of 10 track and field events over two days (men)',
      categoryName: 'Combined Events',
      unitName: 'points',
      isTrackEvent: false,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: true,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: false,
      worldChampionshipEvent: true
    },
    {
      name: 'Heptathlon',
      internationalSign: 'HEP',
      description: 'Combined event consisting of 7 track and field events over two days (women)',
      categoryName: 'Combined Events',
      unitName: 'points',
      isTrackEvent: false,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: true,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: false,
      worldChampionshipEvent: true
    },

    // Race Walking
    {
      name: '20 kilometers race walk',
      internationalSign: '20kmRW',
      description: 'Race walking event over 20 kilometers',
      categoryName: 'Race Walking',
      unitName: 'seconds',
      isTrackEvent: false,
      isFieldEvent: false,
      isRoadEvent: true,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },
    {
      name: '50 kilometers race walk',
      internationalSign: '50kmRW',
      description: 'Race walking event over 50 kilometers',
      categoryName: 'Race Walking',
      unitName: 'seconds',
      isTrackEvent: false,
      isFieldEvent: false,
      isRoadEvent: true,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: false,
      worldChampionshipEvent: true
    },

    // Road Running
    {
      name: 'Marathon',
      internationalSign: 'MAR',
      description: 'Long distance running event of 42.195 kilometers',
      categoryName: 'Road Running',
      unitName: 'kilometers',
      isTrackEvent: false,
      isFieldEvent: false,
      isRoadEvent: true,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: true,
      paralympicEvent: true,
      worldChampionshipEvent: true
    },
    {
      name: 'Half Marathon',
      internationalSign: 'HALF',
      description: 'Long distance running event of 21.0975 kilometers',
      categoryName: 'Road Running',
      unitName: 'kilometers',
      isTrackEvent: false,
      isFieldEvent: false,
      isRoadEvent: true,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: false,
      paralympicEvent: false,
      worldChampionshipEvent: true
    },

    // Cross Country
    {
      name: 'Cross Country',
      internationalSign: 'XC',
      description: 'Running over natural terrain, typically 10km for men and 8km for women',
      categoryName: 'Cross Country',
      unitName: 'kilometers',
      isTrackEvent: false,
      isFieldEvent: false,
      isRoadEvent: false,
      isCombinedEvent: false,
      isTeamEvent: false,
      olympicEvent: false,
      paralympicEvent: false,
      worldChampionshipEvent: true
    }
  ];

  const results = [];
  for (const discipline of disciplines) {
    const categoryId = categoryMap.get(discipline.categoryName);
    const unitId = unitMap.get(discipline.unitName);

    if (!categoryId) {
      console.warn(`Category not found for discipline ${discipline.name}: ${discipline.categoryName}`);
      continue;
    }

    if (!unitId) {
      console.warn(`Unit not found for discipline ${discipline.name}: ${discipline.unitName}`);
      continue;
    }

    const result = await prisma.discipline.upsert({
      where: { name: discipline.name },
      update: {
        internationalSign: discipline.internationalSign,
        description: discipline.description,
        categoryId: categoryId,
        unitId: unitId,
        isTrackEvent: discipline.isTrackEvent,
        isFieldEvent: discipline.isFieldEvent,
        isRoadEvent: discipline.isRoadEvent,
        isCombinedEvent: discipline.isCombinedEvent,
        isTeamEvent: discipline.isTeamEvent,
        olympicEvent: discipline.olympicEvent,
        paralympicEvent: discipline.paralympicEvent,
        worldChampionshipEvent: discipline.worldChampionshipEvent
      },
      create: {
        name: discipline.name,
        internationalSign: discipline.internationalSign,
        description: discipline.description,
        categoryId: categoryId,
        unitId: unitId,
        isTrackEvent: discipline.isTrackEvent,
        isFieldEvent: discipline.isFieldEvent,
        isRoadEvent: discipline.isRoadEvent,
        isCombinedEvent: discipline.isCombinedEvent,
        isTeamEvent: discipline.isTeamEvent,
        olympicEvent: discipline.olympicEvent,
        paralympicEvent: discipline.paralympicEvent,
        worldChampionshipEvent: discipline.worldChampionshipEvent
      }
    });
    results.push(result);
  }

  console.log(`${results.length} disciplines created or updated`);
  return results;
}

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.result.deleteMany();
  await prisma.news.deleteMany();
  await prisma.event.deleteMany();
  // We don't delete athletes as we'll be upserting them
  // await prisma.athlete.deleteMany();
  await prisma.user.deleteMany();
  // await prisma.category.deleteMany();
  // We don't delete discipline-related data as we'll be upserting them
  // await prisma.discipline.deleteMany();
  // await prisma.measurementUnit.deleteMany();
  // await prisma.disciplineCategory.deleteMany();

  console.log('Existing data cleared');

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'el.pionir@gmail.com',
      name: 'Petar Borovcanin',
      passwordHash: '$2a$10$VnbVEJgKB.WYBn8ztRVPXOXcHHKcVq.LYeV.9QvxQ0kGHXVQF1Mw2', // hashed password
      role: 'ADMIN'
    }
  });

  console.log('Admin user created:', adminUser.name);

  // Create or update age categories
  const ageCategories = [
    { name: 'U8', description: 'Children under 8 years old', minAge: 0, maxAge: 7 },
    { name: 'U10', description: 'Children aged 8 to 10 years', minAge: 8, maxAge: 9 },
    { name: 'U12', description: 'Children aged 10 to 12 years', minAge: 10, maxAge: 11 },
    { name: 'U14', description: 'Young cadets (12–14 years)', minAge: 12, maxAge: 13 },
    { name: 'U16', description: 'Cadets (14–16 years)', minAge: 14, maxAge: 15 },
    { name: 'U18', description: 'Junior athletes (16–18 years)', minAge: 16, maxAge: 17 },
    { name: 'U20', description: 'Junior athletes (18–20 years)', minAge: 18, maxAge: 19 },
    { name: 'U23', description: 'Young seniors (20–23 years)', minAge: 20, maxAge: 22 },
    { name: 'SEN', description: 'Senior athletes (typically 20–34 years)', minAge: 20, maxAge: 34 },
    { name: 'V35', description: 'Masters athletes (35–39 years)', minAge: 35, maxAge: 39 },
    { name: 'V40', description: 'Masters athletes (40–44 years)', minAge: 40, maxAge: 44 },
    { name: 'V45', description: 'Masters athletes (45–49 years)', minAge: 45, maxAge: 49 },
    { name: 'V50', description: 'Masters athletes (50–54 years)', minAge: 50, maxAge: 54 },
    { name: 'V55', description: 'Masters athletes (55–59 years)', minAge: 55, maxAge: 59 },
    { name: 'V60', description: 'Masters athletes (60–64 years)', minAge: 60, maxAge: 64 },
    { name: 'V65', description: 'Masters athletes (65–69 years)', minAge: 65, maxAge: 69 },
    { name: 'V70', description: 'Masters athletes (70–74 years)', minAge: 70, maxAge: 74 },
    { name: 'V75', description: 'Masters athletes (75–79 years)', minAge: 75, maxAge: 79 },
    { name: 'V80', description: 'Masters athletes (80+ years)', minAge: 80, maxAge: null },
  ];

  for (const category of ageCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {
        description: category.description,
        minAge: category.minAge,
        maxAge: category.maxAge,
      },
      create: {
        name: category.name,
        description: category.description,
        minAge: category.minAge,
        maxAge: category.maxAge,
      },
    });
  }

  console.log('Age categories created or updated');

  // Athletes data directly included in the seed file
  const athletesData: AthleteData[] = [
    {
      "openTrackId": "05f2e4f2-baad-4449-8cdb-8b98edad5847",
      "fullName": "Adam Vuković",
      "yearOfBirth": "27.06.2002.",
      "category": "SEN",
      "licenseNumber": "12837",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "ad5b61a8-476c-4d2b-a228-0202f56fad16",
      "fullName": "Ivan Garaj",
      "yearOfBirth": "10.02.1998.",
      "category": "SEN",
      "licenseNumber": "14128",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "1877d61b-d6a6-4572-837d-d10271afeb7f",
      "fullName": "Simon Banacan",
      "yearOfBirth": "13.05.2001.",
      "category": "SEN",
      "licenseNumber": "12844",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "06a37401-31e1-4390-8bcd-8e04f90808f3",
      "fullName": "Jonel Bugar",
      "yearOfBirth": "22.05.2008.",
      "category": "U18",
      "licenseNumber": "12843",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "60387b59-689d-4692-8991-0b63d1b54ac6",
      "fullName": "Margareta Starčević",
      "yearOfBirth": "18.05.2004.",
      "category": "U23",
      "licenseNumber": "12842",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "af989112-7eaf-4470-80ca-ebf479f6da2a",
      "fullName": "Dušan Belić",
      "yearOfBirth": "22.04.1997.",
      "category": "SEN",
      "licenseNumber": "12841",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "45f0e579-5555-460a-a49d-d0beac70d04e",
      "fullName": "Nemanja Latinski",
      "yearOfBirth": "4.03.2007.",
      "category": "U20",
      "licenseNumber": "12840",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "03e8527f-e548-421e-b9d9-af106cc02172",
      "fullName": "Milica Kralj",
      "yearOfBirth": "11.01.2004.",
      "category": "U23",
      "licenseNumber": "12839",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "9c908ae4-1330-40b1-bae2-b0b0717051fc",
      "fullName": "Slobodan Stefanović",
      "yearOfBirth": "28.02.2004.",
      "category": "U23",
      "licenseNumber": "12838",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "5008cf3d-e9f0-41ab-807b-3465199880f1",
      "fullName": "Sara Veizović",
      "yearOfBirth": "22.11.2005.",
      "category": "U23",
      "licenseNumber": "14129",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "b35a95f3-a29c-480d-af15-fa32a07948aa",
      "fullName": "Vuk Lakatuš",
      "yearOfBirth": "15.05.2003.",
      "category": "U23",
      "licenseNumber": "12836",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "2066c843-8ad5-49c4-840a-d1e266ef97c4",
      "fullName": "Elena Antić",
      "yearOfBirth": "13.11.2008.",
      "category": "U18",
      "licenseNumber": "12835",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "834fe801-762c-40da-90d2-6687afa04810",
      "fullName": "Stefan Kragujevac",
      "yearOfBirth": "29.08.2008.",
      "category": "U18",
      "licenseNumber": "12834",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "205b5a49-7170-45da-97bf-4d96238c48a7",
      "fullName": "Ivan Karapandžin",
      "yearOfBirth": "1.01.2015.",
      "category": "U12",
      "licenseNumber": "A12833",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "85cddfe1-1cbc-4576-86b1-fbe8bb1283c5",
      "fullName": "Valentina Bokinac Jovanov",
      "yearOfBirth": "13.02.2011.",
      "category": "U16",
      "licenseNumber": "12832",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "3016f1ab-317d-4565-af71-9a3a3a84737b",
      "fullName": "Teodora Antonić",
      "yearOfBirth": "25.11.2009.",
      "category": "U18",
      "licenseNumber": "12831",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "ebf1c9ba-9e62-4c1a-8252-f1ae9fe1479a",
      "fullName": "Ognjen Antonić",
      "yearOfBirth": "20.01.2012.",
      "category": "U14",
      "licenseNumber": "12830",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "9d7cba28-c355-4c50-a237-eadedf4ce58c",
      "fullName": "Zorka Prstojević",
      "yearOfBirth": "11.11.2008.",
      "category": "U18",
      "licenseNumber": "12829",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "02fd9c0c-f2ce-49fe-9bbc-159643d721e1",
      "fullName": "Igor Garaj",
      "yearOfBirth": "10.02.1998.",
      "category": "SEN",
      "licenseNumber": "12800",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "f841835c-389e-47d3-a58d-066d2a7f0c99",
      "fullName": "Danica Erdeljan",
      "yearOfBirth": "29.11.2009.",
      "category": "U18",
      "licenseNumber": "17610",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "6e253acb-a30a-487f-ae5a-f73aa140f40a",
      "fullName": "Simeona Rimai",
      "yearOfBirth": "7.09.2011.",
      "category": "U16",
      "licenseNumber": "16844",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "94ff3245-6dc8-4b35-914f-fe99d122ddac",
      "fullName": "Una Stojković",
      "yearOfBirth": "24.11.2008.",
      "category": "U18",
      "licenseNumber": "16829",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "191a7479-a7e8-4b71-8076-bcdc5aa5d264",
      "fullName": "Luka Stojkov",
      "yearOfBirth": "16.05.2011.",
      "category": "U16",
      "licenseNumber": "16508",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "0a97940e-e085-4366-b81c-1736cb960b58",
      "fullName": "Miljan Milanović",
      "yearOfBirth": "13.02.1997.",
      "category": "SEN",
      "licenseNumber": "16289",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "7f2ac7e1-21df-418a-9db4-3de74d1a2f93",
      "fullName": "Vladimir Reljin",
      "yearOfBirth": "10.09.2012.",
      "category": "U14",
      "licenseNumber": "16132",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "3e8cc65c-33a4-4ed2-b04b-28848eece0f4",
      "fullName": "Dušan Antić",
      "yearOfBirth": "22.04.2011.",
      "category": "U16",
      "licenseNumber": "16131",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "2ccf37a8-eb25-4c86-8373-46ca53b2e5da",
      "fullName": "Benjamin Bojanić",
      "yearOfBirth": "29.12.1998.",
      "category": "SEN",
      "licenseNumber": "50017",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "cb64a4f7-664d-425c-ae7d-ac46b8af59dc",
      "fullName": "Petra Dimitrijević",
      "yearOfBirth": "1.07.2009.",
      "category": "U18",
      "licenseNumber": "12828",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "d4db3821-29f7-4616-9f99-a130b144bbac",
      "fullName": "Valentina Gavrilović",
      "yearOfBirth": "22.04.2010.",
      "category": "U16",
      "licenseNumber": "15960",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "e78fcd60-d8d7-4fb6-8d81-4644dfd80f5d",
      "fullName": "Uglješa Krsteski",
      "yearOfBirth": "25.10.2010.",
      "category": "U16",
      "licenseNumber": "15581",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "ae3b2f3d-baea-47a8-8e66-98e38853e7fa",
      "fullName": "Katarina Ćurčin",
      "yearOfBirth": "12.11.2010.",
      "category": "U16",
      "licenseNumber": "14997",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "10d7ff5d-8a2b-473c-84bb-f68891880b65",
      "fullName": "Jelena Bubulj",
      "yearOfBirth": "27.05.2014.",
      "category": "U12",
      "licenseNumber": "A14804",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "01881f76-d803-47b8-bec3-a7448bc11db0",
      "fullName": "Nađa Vrhovac",
      "yearOfBirth": "18.11.2012.",
      "category": "U14",
      "licenseNumber": "14803",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "3b38b7c8-7bf5-40f1-91ac-6c4b34e5c8b1",
      "fullName": "Nevena Petrović",
      "yearOfBirth": "3.10.2011.",
      "category": "U16",
      "licenseNumber": "14802",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "3a52656f-e238-4c73-8306-9912c244a0a0",
      "fullName": "Pavle Borovčanin",
      "yearOfBirth": "6.04.2011.",
      "category": "U16",
      "licenseNumber": "14801",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "1eda6130-e899-4aa1-be72-fb9feaebf203",
      "fullName": "Milan Došlo",
      "yearOfBirth": "24.10.2010.",
      "category": "U16",
      "licenseNumber": "14800",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "ba2b9c6a-e846-48bd-b650-5e3bdaea765f",
      "fullName": "Luna Antić",
      "yearOfBirth": "22.10.2006.",
      "category": "U20",
      "licenseNumber": "12801",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "9c6ef8a3-c324-48a0-8810-8b2286c6bbc9",
      "fullName": "Dejan Dujaković",
      "yearOfBirth": "9.07.2010.",
      "category": "U16",
      "licenseNumber": "12810",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "47931955-ed01-4bda-a8e5-8a5b9c3e734b",
      "fullName": "Ivan Bajin",
      "yearOfBirth": "26.04.2009.",
      "category": "U18",
      "licenseNumber": "12809",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "3fe0cbc2-66bc-4446-a666-65218280e730",
      "fullName": "Iva Nosonjin",
      "yearOfBirth": "6.11.2009.",
      "category": "U18",
      "licenseNumber": "12808",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "5b402239-d7b6-4ffb-9806-15d848253292",
      "fullName": "Mateja Nosonjin",
      "yearOfBirth": "7.01.2008.",
      "category": "U18",
      "licenseNumber": "12807",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "a9c7cab4-271b-4d18-8ad3-596f61b4e902",
      "fullName": "Emilija Bajin",
      "yearOfBirth": "18.06.2007.",
      "category": "U20",
      "licenseNumber": "12806",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "b2159b4b-7cf2-4bda-90aa-842821655baa",
      "fullName": "Jovan Milošev",
      "yearOfBirth": "1.10.2002.",
      "category": "SEN",
      "licenseNumber": "12804",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "8d6f9b25-6fb7-4db2-b406-e816855ef0a4",
      "fullName": "Anastasija Kašaš",
      "yearOfBirth": "26.08.2004.",
      "category": "U23",
      "licenseNumber": "12803",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "38ac08e9-5d8f-4841-9a3c-2b0f6c8b7b45",
      "fullName": "Milica Trbojević",
      "yearOfBirth": "26.03.2007.",
      "category": "U20",
      "licenseNumber": "12802",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "652945cc-1352-4235-9374-81d80ba52167",
      "fullName": "Stefan Gospodinački",
      "yearOfBirth": "28.08.2008.",
      "category": "U18",
      "licenseNumber": "12811",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "3e28fc9b-d280-4214-b66d-d51125e529e2",
      "fullName": "Angela Terek",
      "yearOfBirth": "11.05.1991.",
      "category": "SEN",
      "licenseNumber": "12799",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "a5215582-8b93-4e1c-9dc8-79d726aed514",
      "fullName": "Darko Antić",
      "yearOfBirth": "21.04.1981.",
      "category": "V40",
      "licenseNumber": "12798",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "e8d5b0e0-920d-4bd1-9e65-6e92507a9233",
      "fullName": "Anđela Kojović",
      "yearOfBirth": "1.03.2006.",
      "category": "U20",
      "licenseNumber": "12797",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "264eed87-24a0-4ca2-9e1f-31230e9decd1",
      "fullName": "Jovana Stojanov",
      "yearOfBirth": "2.01.2004.",
      "category": "U23",
      "licenseNumber": "12796",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "5fdfbeb9-9667-4ca7-816e-987a338dcae9",
      "fullName": "Mladen Grujić",
      "yearOfBirth": "31.12.1970.",
      "category": "V50",
      "licenseNumber": "12795",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "b86d9c01-6196-4171-baf5-f1c111f7bb3d",
      "fullName": "Nikola Ubavić",
      "yearOfBirth": "16.07.1997.",
      "category": "SEN",
      "licenseNumber": "12794",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "b52b4192-9881-43b3-b71d-dab06e2ae21b",
      "fullName": "Gordana Stankov",
      "yearOfBirth": "29.07.1993.",
      "category": "SEN",
      "licenseNumber": "12793",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "985fb40b-f38b-4e56-8334-36389f5d77cf",
      "fullName": "Tea Mašić",
      "yearOfBirth": "10.04.2008.",
      "category": "U18",
      "licenseNumber": "12819",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "2757554b-fead-4ce5-9d61-7668311d98ca",
      "fullName": "Jovana Vojinov",
      "yearOfBirth": "30.01.2011.",
      "category": "U16",
      "licenseNumber": "12827",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "eaa2bd19-0449-4cf9-b1ec-7a4d1e9202bb",
      "fullName": "Aleksa Bajin",
      "yearOfBirth": "26.02.2009.",
      "category": "U18",
      "licenseNumber": "12826",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "d43a7609-219a-488b-a181-078a46a03ce4",
      "fullName": "Maša Trbojević",
      "yearOfBirth": "25.05.2008.",
      "category": "U18",
      "licenseNumber": "12825",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "7e82724b-6646-471d-8fbc-ac75d7632f9a",
      "fullName": "Ognjen Beljin",
      "yearOfBirth": "19.02.2010.",
      "category": "U16",
      "licenseNumber": "12824",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "ee170473-dac5-4a50-ac38-c8ceaca4c9f3",
      "fullName": "Nina Cvejić",
      "yearOfBirth": "21.03.2008.",
      "category": "U18",
      "licenseNumber": "12823",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "93cad877-aa6c-456c-9323-37d037b5d069",
      "fullName": "Ognjen Popov",
      "yearOfBirth": "8.03.2009.",
      "category": "U18",
      "licenseNumber": "12822",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "4ccd4c03-3d32-4fde-823b-87957782ab41",
      "fullName": "Miloš Jovičić",
      "yearOfBirth": "1.04.2007.",
      "category": "U20",
      "licenseNumber": "12821",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "4123029a-8c50-4ea9-9832-cedd35524102",
      "fullName": "Nikola Nenin",
      "yearOfBirth": "16.11.2011.",
      "category": "U16",
      "licenseNumber": "12820",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "e3eb7200-c0e2-4fc3-b98e-52cde27653de",
      "fullName": "Velibor Nikolić",
      "yearOfBirth": "14.02.1997.",
      "category": "SEN",
      "licenseNumber": "12792",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "902d2e6b-ee44-4a17-93eb-edac506dc7f2",
      "fullName": "Andrej Radivojkov",
      "yearOfBirth": "12.08.2008.",
      "category": "U18",
      "licenseNumber": "12818",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "47604e98-a598-4d5e-a518-afe0c862f89f",
      "fullName": "Milica Ljubojević",
      "yearOfBirth": "27.11.2009.",
      "category": "U18",
      "licenseNumber": "12817",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "d1591300-2551-40f9-a3e5-62ecf9539ab6",
      "fullName": "Filip Koska",
      "yearOfBirth": "1.03.2012.",
      "category": "U14",
      "licenseNumber": "12816",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "3f787b3c-da6a-4a27-aeb1-ca2edab8384f",
      "fullName": "Lena Avramovic",
      "yearOfBirth": "28.04.2009.",
      "category": "U18",
      "licenseNumber": "12815",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "9cdba9eb-f2f6-4e90-ae9b-33361c6a115a",
      "fullName": "Maša Vasiljević",
      "yearOfBirth": "19.11.2010.",
      "category": "U16",
      "licenseNumber": "12814",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "c5a50ba4-9647-4069-a23a-5fd824c4c8b0",
      "fullName": "Teodora Vuksanović",
      "yearOfBirth": "16.07.2005.",
      "category": "U23",
      "licenseNumber": "12813",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "8c938768-0dff-4e4a-94df-09144590634a",
      "fullName": "Dijana Vuksanović",
      "yearOfBirth": "15.10.2007.",
      "category": "U20",
      "licenseNumber": "12812",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    },
    {
      "openTrackId": "eb9bb470-ca45-43ec-899a-14a9fb369f05",
      "fullName": "Jovana Gladić",
      "yearOfBirth": "4.04.2003.",
      "category": "U23",
      "licenseNumber": "12805",
      "expirationDate": "31.12.2025.",
      "lastCompetitionDate": null
    }
  ];

  console.log(`Processing ${athletesData.length} athletes`);

  // Get all categories for reference
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map(cat => [cat.name, cat.id]));

  // Process each athlete
  let createdCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  // First, get existing athletes to determine if we're creating or updating
  const existingAthletes = await prisma.athlete.findMany({
    where: {
      openTrackId: {
        in: athletesData.map(a => a.openTrackId)
      }
    },
    select: {
      openTrackId: true
    }
  });

  // Create a set of existing openTrackIds for faster lookup
  const existingOpenTrackIds = new Set(existingAthletes.map(a => a.openTrackId));

  for (const athleteData of athletesData) {
    const dateOfBirth = parseDate(athleteData.yearOfBirth);
    const categoryId = categoryMap.get(athleteData.category) || null;
    const isUpdate = existingOpenTrackIds.has(athleteData.openTrackId);

    try {
      // Determine gender based on name
      const gender = determineGender(athleteData.fullName);

      // Get a gender-appropriate avatar for this athlete
      const avatarUrl = getRandomAvatar(gender);

      // Check if athlete exists by openTrackId
      const existingAthlete = await prisma.athlete.findFirst({
        where: {
          openTrackId: athleteData.openTrackId
        }
      });

      if (existingAthlete) {
        // Update existing athlete
        await prisma.athlete.update({
          where: { id: existingAthlete.id },
          data: {
            name: athleteData.fullName,
            dateOfBirth,
            categoryId,
            avatarUrl, // Add avatar URL to update
            gender, // Update gender based on name
          },
        });
      } else {
        // Create new athlete
        await prisma.athlete.create({
          data: {
            openTrackId: athleteData.openTrackId,
            name: athleteData.fullName,
            dateOfBirth,
            categoryId,
            avatarUrl, // Add avatar URL to create
            gender, // Use the determined gender
          },
        });
      }

      if (isUpdate) {
        updatedCount++;
      } else {
        createdCount++;
      }
    } catch (error) {
      console.error(`Error processing athlete ${athleteData.fullName}:`, error);
      errorCount++;
    }
  }

  console.log(`Athletes processed: ${createdCount} created, ${updatedCount} updated, ${errorCount} errors`);

  try {
    // Seed discipline categories
    console.log('Starting to seed discipline categories...');
    const disciplineCategories = await seedDisciplineCategories();

    // Seed measurement units
    console.log('Starting to seed measurement units...');
    const measurementUnits = await seedMeasurementUnits();

    // Seed disciplines
    console.log('Starting to seed disciplines...');
    await seedDisciplines(disciplineCategories, measurementUnits);
  } catch (error) {
    console.error('Error seeding discipline data:', error);
  }

  console.log('Database seeding completed');
}

// Wrap the main function in a self-executing async function to ensure proper error handling
(async () => {
  try {
    await main();
  } catch (e) {
    console.error('Error in main function:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
