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

  @Column({ type: 'double precision' })
  reportedHashrate: string;

  @Column({ type: 'double precision' })
  currentHashrate: string;

  @Column()
  validShares: number;

  @Column()
  invalidShares: number;

  @Column()
  staleShares: number;

  @Column({ type: 'double precision' })
  averageHashrate: string;

  @Column({ type: 'double precision' })
  coinsPerMin: string;

  @Column({ type: 'double precision' })
  usdPerMin: string;

  @Column({ type: 'double precision' })
  btcPerMin: string;
}
