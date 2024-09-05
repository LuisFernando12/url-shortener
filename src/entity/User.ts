import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";
import { Url } from "./Urls";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "varchar", nullable: false})
  name: string;

  @Column({unique: true, type: "varchar", nullable: false})
  email: string;

  @Column({type: "varchar", nullable: false})
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Url, url => url.user )
  urls: Url[];
}
