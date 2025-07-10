import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, IsDateString } from 'class-validator';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Column({ name: 'last_name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ name: 'phone_number' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  @IsDateString()
  @IsNotEmpty()
  dob: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 