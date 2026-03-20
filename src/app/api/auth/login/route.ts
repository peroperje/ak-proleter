import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcrypt';
import { signToken } from '@/app/lib/jwt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      );
    }

    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        athlete: true,
        // Add more relations if needed, e.g. coach
      }
    });

    // 3. Check if user exists and has a password
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    // 4. Check if password matches
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    // 5. Build user response (matches mobile app's UserDto)
    const userDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      athleteId: user.athlete?.id,
    };

    // 6. Generate JWT token
    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // 7. Return the response in format expected by mobile
    return NextResponse.json({
      user: { ...userDto, token },
      token: token,
    });

  } catch (error: any) {
    console.error('Mobile Auth API Error:', error);
    return NextResponse.json(
      { error: 'Authentication failed', message: error.message },
      { status: 500 },
    );
  }
}
