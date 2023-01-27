import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Scenes } from './scenes.entity';

@Entity()
export class Warps {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Scenes, (scenes) => scenes)
  @JoinColumn({
    name: 'scene_id',
  })
  scenes: Scenes;

  @Column()
  position_top: number;

  @Column()
  position_left: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  warps_to: string;
}
