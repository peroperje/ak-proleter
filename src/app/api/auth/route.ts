import { NextResponse } from 'next/server';
import { User } from '@/app/lib/definitions';

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@akproleter.rs',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123', // In a real app, this would be hashed
  },
  {
    id: '2',
    email: 'coach@akproleter.rs',
    name: 'Coach User',
    role: 'coach',
    coachId: '1',
    password: 'coach123', // In a real app, this would be hashed
  },
  {
    id: '3',
    email: 'marko.petrovic@example.com',
    name: 'Marko Petrović',
    role: 'athlete',
    athleteId: '1',
    password: 'athlete123', // In a real app, this would be hashed
  },
  {
    id: '4',
    email: 'viewer@akproleter.rs',
    name: 'Viewer User',
    role: 'viewer',
    password: 'viewer123', // In a real app, this would be hashed
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = mockUsers.find(u => u.email === body.email);

    // Check if user exists and password matches
    if (!user || user.password !== body.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // In a real application, you would:
    // 1. Use a proper password hashing library like bcrypt
    // 2. Generate a JWT token or session
    // 3. Set cookies or return the token

    // For this demo, we'll just return the user without the password
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      // In a real app, you would include a token here
      token: 'mock-jwt-token',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// Route to check if a user is authenticated
export async function GET(request: Request) {
  // In a real application, you would:
  // 1. Get the token from the Authorization header or cookies
  // 2. Verify the token
  // 3. Return the user information if valid

  // For this demo, we'll just return a mock response
  return NextResponse.json({
    authenticated: true,
    user: {
      id: '1',
      email: 'admin@akproleter.rs',
      name: 'Admin User',
      role: 'admin',
    }
  });
}
