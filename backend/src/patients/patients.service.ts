import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      const patient = this.patientsRepository.create(createPatientDto);
      return await this.patientsRepository.save(patient);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictException('Patient with this email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Patient[]> {
    return await this.patientsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    await this.findOne(id);

    try {
      await this.patientsRepository.update(id, updatePatientDto);
      return await this.findOne(id);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictException('Patient with this email already exists');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientsRepository.remove(patient);
  }
} 