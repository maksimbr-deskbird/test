import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ name: 'first_name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Column({ name: 'last_name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Exclude()
  password: string;

  @Column({
    type: 'varchar',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 