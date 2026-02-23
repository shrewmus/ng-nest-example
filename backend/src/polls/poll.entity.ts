import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'polls' })
export class Poll {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 255 })
  optionA!: string;

  @Column({ type: 'varchar', length: 255 })
  optionB!: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
