import { NextResponse } from 'next/server';
import { User } from '@/app/lib/definitions';
import prisma from '@/app/lib/prisma';
import * as bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    // Check if password matches
    // In a real app, you would use bcrypt.compare
    // For this demo, we'll just check if the password matches the hashed password
    // This is not secure and should not be used in production
    const passwordMatches = await bcrypt.compare(
      body.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    // Map Prisma User to our User interface
    const userResponse: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.toLowerCase() as 'admin' | 'coach' | 'athlete' | 'viewer',
    };

    // In a real app, you would generate a JWT token here
    return NextResponse.json({
      user: userResponse,
      token: 'mock-jwt-token', // In a real app, this would be a JWT token
    });
  } catch (error) {
    console.error('Error authenticating user:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 },
    );
  }
}

// Route to check if a user is authenticated
export async function GET() {
  try {
    // In a real application, you would:
    // 1. Get the token from the Authorization header or cookies
    // 2. Verify the token
    // 3. Return the user information if valid

    // For this demo, we'll get the first admin user from the database
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!adminUser) {
      return NextResponse.json(
        {
          authenticated: false,
          error: 'No admin user found',
        },
        { status: 401 },
      );
    }

    // Map Prisma User to our User interface
    const userResponse: User = {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role.toLowerCase() as
        | 'admin'
        | 'coach'
        | 'athlete'
        | 'viewer',
    };

    return NextResponse.json({
      authenticated: true,
      user: userResponse,
    });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json(
      {
        authenticated: false,
        error: 'Authentication check failed',
      },
      { status: 500 },
    );
  }
}
