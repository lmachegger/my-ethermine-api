import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stat')
export class StatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  time: number;

  @Column({ type: 'double precision', nullable: true })
  reportedHashrate: string;

  @Column({ type: 'double precision', nullable: true })
  currentHashrate: string;

  @Column({ nullable: true })
  validShares: number;

  @Column({ nullable: true })
  invalidShares: number;

  @Column({ nullable: true })
  staleShares: number;

  @Column({ type: 'double precision', nullable: true })
  averageHashrate: string;

  @Column({ type: 'double precision', nullable: true })
  coinsPerMin: string;

  @Column({ type: 'double precision', nullable: true })
  usdPerMin: string;

  @Column({ type: 'double precision', nullable: true })
  btcPerMin: string;
}
