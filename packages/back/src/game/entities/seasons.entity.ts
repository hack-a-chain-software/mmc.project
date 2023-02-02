import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Scenes } from './scenes.entity';

@Entity()
export class Seasons {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  config: string;

  @Column()
  season_ends_at: string;

  @Column()
  created_at: string;

  @OneToMany(() => Scenes, (scenes) => scenes.seasons)
  scenes: Scenes[];
}
