import { NextResponse } from 'next/server';
import { Athlete } from '@/app/lib/definitions';

// Mock data for demonstration
const mockAthletes: Athlete[] = [
  {
    id: '1',
    firstName: 'Marko',
    lastName: 'Petrović',
    dateOfBirth: new Date('1998-05-15'),
    gender: 'male',
    email: 'marko.petrovic@example.com',
    phone: '+381 63 123 4567',
    joinDate: new Date('2020-01-10'),
    active: true,
    categories: ['Senior', 'Long Distance'],
  },
  {
    id: '2',
    firstName: 'Ana',
    lastName: 'Jovanović',
    dateOfBirth: new Date('2000-08-22'),
    gender: 'female',
    email: 'ana.jovanovic@example.com',
    phone: '+381 64 987 6543',
    joinDate: new Date('2019-03-15'),
    active: true,
    categories: ['U23', 'Sprint'],
  },
  {
    id: '3',
    firstName: 'Nikola',
    lastName: 'Đorđević',
    dateOfBirth: new Date('1995-11-30'),
    gender: 'male',
    email: 'nikola.djordjevic@example.com',
    phone: '+381 65 456 7890',
    joinDate: new Date('2018-06-20'),
    active: false,
    categories: ['Senior', 'Throws'],
  },
];

export async function GET(request: Request) {
  // Get search params from URL
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // If ID is provided, return a specific athlete
  if (id) {
    const athlete = mockAthletes.find(a => a.id === id);

    if (!athlete) {
      return NextResponse.json(
        { error: 'Athlete not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(athlete);
  }

  // Otherwise return all athletes
  return NextResponse.json(mockAthletes);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.dateOfBirth || !body.gender) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a new athlete with a generated ID
    const newAthlete: Athlete = {
      id: `${mockAthletes.length + 1}`,
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: new Date(body.dateOfBirth),
      gender: body.gender,
      email: body.email,
      phone: body.phone,
      joinDate: body.joinDate ? new Date(body.joinDate) : new Date(),
      active: body.active !== undefined ? body.active : true,
      categories: body.categories || [],
      notes: body.notes,
      photoUrl: body.photoUrl,
      address: body.address,
      emergencyContact: body.emergencyContact,
    };

    // In a real application, this would save to a database
    // For this demo, we'll just return the new athlete

    return NextResponse.json(newAthlete, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Athlete ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // In a real application, this would update the database
    // For this demo, we'll just return the updated athlete

    const updatedAthlete: Athlete = {
      id,
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: new Date(body.dateOfBirth),
      gender: body.gender,
      email: body.email,
      phone: body.phone,
      joinDate: new Date(body.joinDate),
      active: body.active,
      categories: body.categories || [],
      notes: body.notes,
      photoUrl: body.photoUrl,
      address: body.address,
      emergencyContact: body.emergencyContact,
    };

    return NextResponse.json(updatedAthlete);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Athlete ID is required' },
      { status: 400 }
    );
  }

  // In a real application, this would delete from the database
  // For this demo, we'll just return a success message

  return NextResponse.json({ success: true });
}
