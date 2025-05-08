import { NextResponse } from 'next/server';
import { Athlete } from '@/app/lib/definitions';
import prisma from '@/app/lib/prisma';

export async function GET(request: Request) {
  try {
    // Get search params from URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If ID is provided, return a specific athlete
    if (id) {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          profile: {
            include: {
              category: true
            }
          }
        }
      });

      if (!user || user.role !== 'MEMBER') {
        return NextResponse.json(
          { error: 'Athlete not found' },
          { status: 404 }
        );
      }

      // Transform the user data to match the Athlete interface
      const athlete: Athlete = {
        id: user.id,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ').slice(1).join(' '),
        dateOfBirth: user.profile?.dateOfBirth || new Date(),
        gender: 'male', // This information is not in the schema, defaulting to male
        email: user.email,
        phone: user.profile?.phoneNumber || undefined,
        joinDate: user.createdAt,
        active: true, // This information is not in the schema, defaulting to true
        categories: user.profile?.category ? [user.profile.category.name] : [],
        address: user.profile?.address || undefined,
      };

      return NextResponse.json(athlete);
    }

    // Otherwise return all athletes
    const users = await prisma.user.findMany({
      where: { role: 'MEMBER' },
      include: {
        profile: {
          include: {
            category: true
          }
        }
      }
    });

    // Transform the user data to match the Athlete interface
    const athletes: Athlete[] = users.map(user => ({
      id: user.id,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ').slice(1).join(' '),
      dateOfBirth: user.profile?.dateOfBirth || new Date(),
      gender: 'male', // This information is not in the schema, defaulting to male
      email: user.email,
      phone: user.profile?.phoneNumber || undefined,
      joinDate: user.createdAt,
      active: true, // This information is not in the schema, defaulting to true
      categories: user.profile?.category ? [user.profile.category.name] : [],
      address: user.profile?.address || undefined,
    }));

    return NextResponse.json(athletes);
  } catch (error) {
    console.error('Error fetching athletes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch athletes' },
      { status: 500 }
    );
  }
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

    // Find or create categories
    const categoryIds = [];
    if (body.categories && body.categories.length > 0) {
      for (const categoryName of body.categories) {
        const category = await prisma.category.upsert({
          where: { name: categoryName },
          update: {},
          create: { name: categoryName },
        });
        categoryIds.push(category.id);
      }
    }

    // Create a new user with profile
    const newUser = await prisma.user.create({
      data: {
        name: `${body.firstName} ${body.lastName}`,
        email: body.email || `${body.firstName.toLowerCase()}.${body.lastName.toLowerCase()}@example.com`,
        passwordHash: 'placeholder', // In a real app, this would be properly hashed
        role: 'MEMBER',
        profile: {
          create: {
            dateOfBirth: new Date(body.dateOfBirth),
            phoneNumber: body.phone,
            address: body.address,
            bio: body.notes,
            avatarUrl: body.photoUrl,
            categoryId: categoryIds.length > 0 ? categoryIds[0] : null,
          }
        }
      },
      include: {
        profile: {
          include: {
            category: true
          }
        }
      }
    });

    // Transform the user data to match the Athlete interface
    const newAthlete: Athlete = {
      id: newUser.id,
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: new Date(body.dateOfBirth),
      gender: body.gender,
      email: newUser.email,
      phone: newUser.profile?.phoneNumber || undefined,
      joinDate: newUser.createdAt,
      active: true,
      categories: categoryIds.length > 0 ? body.categories : [],
      notes: body.notes,
      photoUrl: body.photoUrl,
      address: body.address,
      emergencyContact: body.emergencyContact,
    };

    return NextResponse.json(newAthlete, { status: 201 });
  } catch (error) {
    console.error('Error creating athlete:', error);
    return NextResponse.json(
      { error: 'Failed to create athlete' },
      { status: 500 }
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

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    });

    if (!existingUser || existingUser.role !== 'MEMBER') {
      return NextResponse.json(
        { error: 'Athlete not found' },
        { status: 404 }
      );
    }

    // Find or create categories
    let categoryId = null;
    if (body.categories && body.categories.length > 0) {
      const category = await prisma.category.upsert({
        where: { name: body.categories[0] },
        update: {},
        create: { name: body.categories[0] },
      });
      categoryId = category.id;
    }

    // Update user and profile
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        profile: {
          upsert: {
            create: {
              dateOfBirth: new Date(body.dateOfBirth),
              phoneNumber: body.phone,
              address: body.address,
              bio: body.notes,
              avatarUrl: body.photoUrl,
              categoryId: categoryId,
            },
            update: {
              dateOfBirth: new Date(body.dateOfBirth),
              phoneNumber: body.phone,
              address: body.address,
              bio: body.notes,
              avatarUrl: body.photoUrl,
              categoryId: categoryId,
            }
          }
        }
      },
      include: {
        profile: {
          include: {
            category: true
          }
        }
      }
    });

    // Transform the user data to match the Athlete interface
    const updatedAthlete: Athlete = {
      id: updatedUser.id,
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: new Date(body.dateOfBirth),
      gender: body.gender,
      email: updatedUser.email,
      phone: updatedUser.profile?.phoneNumber || undefined,
      joinDate: body.joinDate ? new Date(body.joinDate) : updatedUser.createdAt,
      active: body.active,
      categories: updatedUser.profile?.category ? [updatedUser.profile.category.name] : [],
      notes: body.notes,
      photoUrl: body.photoUrl,
      address: body.address,
      emergencyContact: body.emergencyContact,
    };

    return NextResponse.json(updatedAthlete);
  } catch (error) {
    console.error('Error updating athlete:', error);
    return NextResponse.json(
      { error: 'Failed to update athlete' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Athlete ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser || existingUser.role !== 'MEMBER') {
      return NextResponse.json(
        { error: 'Athlete not found' },
        { status: 404 }
      );
    }

    // Delete the user (this will cascade delete the profile due to the onDelete: Cascade in the schema)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting athlete:', error);
    return NextResponse.json(
      { error: 'Failed to delete athlete' },
      { status: 500 }
    );
  }
}
