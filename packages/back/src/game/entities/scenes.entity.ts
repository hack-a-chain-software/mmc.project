import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Clues } from './clues.entity';
import { Warps } from './warps.entity';
import { Images } from './images.entity';
import { Seasons } from './seasons.entity';

@Entity()
export class Scenes {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  description: string;

  @Column()
  name: string;

  @Column()
  available_at: string;

  @ManyToOne(() => Seasons, (seasons) => seasons)
  @JoinColumn({
    name: 'season_id',
  })
  seasons: Seasons;

  @OneToMany(() => Clues, (clues) => clues.scenes)
  clues: Clues[];

  @OneToMany(() => Warps, (warps) => warps.scenes)
  warps: Warps[];

  @OneToMany(() => Images, (images) => images.scenes)
  images: Images[];
}
