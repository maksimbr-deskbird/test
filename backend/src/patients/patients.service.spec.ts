import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

describe('PatientsService', () => {
  let service: PatientsService;
  let repository: Repository<Patient>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPatient: Patient = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1-555-0123',
    dob: '1980-01-15',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    repository = module.get<Repository<Patient>>(getRepositoryToken(Patient));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createPatientDto: CreatePatientDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1-555-0123',
      dob: '1980-01-15',
    };

    it('should create a patient successfully', async () => {
      mockRepository.create.mockReturnValue(mockPatient);
      mockRepository.save.mockResolvedValue(mockPatient);

      const result = await service.create(createPatientDto);

      expect(repository.create).toHaveBeenCalledWith(createPatientDto);
      expect(repository.save).toHaveBeenCalledWith(mockPatient);
      expect(result).toEqual(mockPatient);
    });

    it('should throw ConflictException when email already exists', async () => {
      const error = { code: 'SQLITE_CONSTRAINT_UNIQUE' };
      mockRepository.create.mockReturnValue(mockPatient);
      mockRepository.save.mockRejectedValue(error);

      await expect(service.create(createPatientDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of patients', async () => {
      const patients = [mockPatient];
      mockRepository.find.mockResolvedValue(patients);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(patients);
    });
  });

  describe('findOne', () => {
    it('should return a patient when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockPatient);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockPatient);
    });

    it('should throw NotFoundException when patient not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updatePatientDto: UpdatePatientDto = {
      firstName: 'Jane',
    };

    it('should update a patient successfully', async () => {
      const updatedPatient = { ...mockPatient, ...updatePatientDto };
      mockRepository.findOne
        .mockResolvedValueOnce(mockPatient)
        .mockResolvedValueOnce(updatedPatient);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updatePatientDto);

      expect(repository.update).toHaveBeenCalledWith(1, updatePatientDto);
      expect(result).toEqual(updatedPatient);
    });

    it('should throw NotFoundException when patient not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updatePatientDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a patient successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockPatient);
      mockRepository.remove.mockResolvedValue(mockPatient);

      await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(mockPatient);
    });

    it('should throw NotFoundException when patient not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
}); 