import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('stat')
export class StatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  time: number;

  @Column({ type: 'real' })
  reportedHashrate: string;

  @Column({ type: 'real' })
  currentHashrate: string;

  @Column()
  validShares: number;

  @Column()
  invalidShares: number;

  @Column()
  staleShares: number;

  @Column({ type: 'real' })
  averageHashrate: string;

  @Column({ type: 'real' })
  coinsPerMin: string;

  @Column({ type: 'real' })
  usdPerMin: string;

  @Column({ type: 'real' })
  btcPerMin: string;
}
