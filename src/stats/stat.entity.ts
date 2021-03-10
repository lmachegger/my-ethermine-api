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

  @Column()
  reportedHashrate: number;

  @Column()
  currentHashrate: number;

  @Column()
  validShares: number;

  @Column()
  invalidShares: number;

  @Column()
  staleShares: number;

  @Column()
  averageHashrate: number;

  @Column()
  coinsPerMin: number;

  @Column()
  usdPerMin: number;

  @Column()
  btcPerMin: number;
}
