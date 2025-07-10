import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { PatientsService } from '../patients/patients.service';
import { UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const app = await NestFactory.create(AppModule, { logger: false });
  
  const usersService = app.get(UsersService);
  const patientsService = app.get(PatientsService);

  try {
    console.log('🌱 Starting database seeding...');

    const adminExists = await usersService.findByEmail('admin@example.com');
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await usersService.create({
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    const userExists = await usersService.findByEmail('user@example.com');
    if (!userExists) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await usersService.create({
        email: 'user@example.com',
        firstName: 'Regular',
        lastName: 'User',
        password: hashedPassword,
        role: UserRole.USER,
      });
      console.log('✅ Regular user created');
    } else {
      console.log('ℹ️  Regular user already exists');
    }

    const samplePatients = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phoneNumber: '+1-555-0123',
        dob: '1980-01-15',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phoneNumber: '+1-555-0124',
        dob: '1975-06-22',
      },
      {
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.johnson@email.com',
        phoneNumber: '+1-555-0125',
        dob: '1990-03-10',
      },
      {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@email.com',
        phoneNumber: '+1-555-0126',
        dob: '1985-09-18',
      },
      {
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@email.com',
        phoneNumber: '+1-555-0127',
        dob: '1992-12-05',
      },
    ];

    for (const patientData of samplePatients) {
      try {
        await patientsService.create(patientData);
        console.log(`✅ Patient ${patientData.firstName} ${patientData.lastName} created`);
      } catch (error) {
        console.log(`ℹ️  Patient ${patientData.firstName} ${patientData.lastName} already exists`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 You can now use these accounts:');
    console.log('👤 Admin: admin@example.com / password123');
    console.log('👤 User: user@example.com / password123');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
}); 