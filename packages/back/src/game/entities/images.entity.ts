import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Scenes } from './scenes.entity';

@Entity()
export class Images {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Scenes, (scenes) => scenes)
  @JoinColumn({
    name: 'scene_id',
  })
  scenes: Scenes;

  @Column()
  media: string;

  @Column()
  z_index: number;
}
