import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "varchar", nullable: false})
  longUrl: string;

  @Column({ unique: true, type: "varchar", nullable: false })
  hash: string;
  
  @Column({ unique: true, type: "varchar", nullable: false })
  shortenedUrl: string;

  @CreateDateColumn({type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({type: "timestamp"})
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.urls, { nullable: true })
  user: User;
}
