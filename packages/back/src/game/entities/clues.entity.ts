import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Scenes } from './scenes.entity';

@Entity()
export class Clues {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Scenes, (scenes) => scenes)
  @JoinColumn({
    name: 'scene_id',
  })
  scenes: Scenes;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  position_top: number;

  @Column()
  position_left: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  media: string;

  @Column()
  placeholder: string;

  @Column()
  nft_id: string;
}
