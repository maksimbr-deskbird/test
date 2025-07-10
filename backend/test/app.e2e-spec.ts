import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let patientId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    describe('/api/auth/register (POST)', () => {
      it('should register a new admin user', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            email: 'admin@test.com',
            firstName: 'Admin',
            lastName: 'User',
            password: 'password123',
            role: 'admin',
          })
          .expect(201);

        expect(response.body).toHaveProperty('access_token');
        expect(response.body.user).toEqual({
          id: expect.any(Number),
          email: 'admin@test.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
        });

        adminToken = response.body.access_token;
      });

      it('should register a new regular user', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            email: 'user@test.com',
            firstName: 'Regular',
            lastName: 'User',
            password: 'password123',
            role: 'user',
          })
          .expect(201);

        expect(response.body).toHaveProperty('access_token');
        expect(response.body.user.role).toBe('user');
        
        userToken = response.body.access_token;
      });

      it('should fail with invalid email', async () => {
        await request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            email: 'invalid-email',
            firstName: 'Test',
            lastName: 'User',
            password: 'password123',
            role: 'user',
          })
          .expect(400);
      });

      it('should fail with duplicate email', async () => {
        await request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            email: 'admin@test.com',
            firstName: 'Another',
            lastName: 'Admin',
            password: 'password123',
            role: 'admin',
          })
          .expect(409);
      });
    });

    describe('/api/auth/login (POST)', () => {
      it('should login with valid credentials', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: 'admin@test.com',
            password: 'password123',
          })
          .expect(201);

        expect(response.body).toHaveProperty('access_token');
        expect(response.body.user.email).toBe('admin@test.com');
      });

      it('should fail with invalid credentials', async () => {
        await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({
            email: 'admin@test.com',
            password: 'wrongpassword',
          })
          .expect(401);
      });
    });

    describe('/api/auth/profile (GET)', () => {
      it('should get profile with valid token', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/auth/profile')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body).toEqual({
          id: expect.any(Number),
          email: 'admin@test.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          password: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });

      it('should fail without token', async () => {
        await request(app.getHttpServer())
          .get('/api/auth/profile')
          .expect(401);
      });
    });
  });

  describe('Patients', () => {
    describe('/api/patients (POST)', () => {
      it('should create a patient as admin', async () => {
        const patientData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '+1-555-0123',
          dob: '1980-01-15',
        };

        const response = await request(app.getHttpServer())
          .post('/api/patients')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(patientData)
          .expect(201);

        expect(response.body).toMatchObject(patientData);
        expect(response.body.id).toBeDefined();
        
        patientId = response.body.id;
      });

      it('should fail to create patient as regular user', async () => {
        const patientData = {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phoneNumber: '+1-555-0124',
          dob: '1985-03-20',
        };

        await request(app.getHttpServer())
          .post('/api/patients')
          .set('Authorization', `Bearer ${userToken}`)
          .send(patientData)
          .expect(403);
      });

      it('should fail with invalid data', async () => {
        await request(app.getHttpServer())
          .post('/api/patients')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            firstName: 'John',
            // Missing required fields
          })
          .expect(400);
      });
    });

    describe('/api/patients (GET)', () => {
      it('should get all patients as admin', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/patients')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });

      it('should get all patients as regular user', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/patients')
          .set('Authorization', `Bearer ${userToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });

      it('should fail without authentication', async () => {
        await request(app.getHttpServer())
          .get('/api/patients')
          .expect(401);
      });
    });

    describe('/api/patients/:id (GET)', () => {
      it('should get patient by id', async () => {
        const response = await request(app.getHttpServer())
          .get(`/api/patients/${patientId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.id).toBe(patientId);
        expect(response.body.firstName).toBe('John');
      });

      it('should fail with non-existent id', async () => {
        await request(app.getHttpServer())
          .get('/api/patients/999')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);
      });
    });

    describe('/api/patients/:id (PATCH)', () => {
      it('should update patient as admin', async () => {
        const updateData = {
          firstName: 'John Updated',
        };

        const response = await request(app.getHttpServer())
          .patch(`/api/patients/${patientId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body.firstName).toBe('John Updated');
      });

      it('should fail to update patient as regular user', async () => {
        await request(app.getHttpServer())
          .patch(`/api/patients/${patientId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ firstName: 'Should Not Update' })
          .expect(403);
      });
    });

    describe('/api/patients/:id (DELETE)', () => {
      it('should fail to delete patient as regular user', async () => {
        await request(app.getHttpServer())
          .delete(`/api/patients/${patientId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);
      });

      it('should delete patient as admin', async () => {
        await request(app.getHttpServer())
          .delete(`/api/patients/${patientId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);
      });

      it('should fail to delete non-existent patient', async () => {
        await request(app.getHttpServer())
          .delete('/api/patients/999')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);
      });
    });
  });
}); 