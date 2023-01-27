import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Guess {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  wallet_id: string;

  @Column()
  who_murdered: string;

  @Column()
  weapon: string;

  @Column()
  motive: string;

  @Column()
  random_number: number;

  @Column()
  hash: string;

  @Column()
  created_at: string;

  constructor(partial: Partial<Guess>) {
    Object.assign(this, partial);
  }
}