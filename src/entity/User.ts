import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
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
  @OneToMany(() => Url, url => url.userId )
  urls: Url;
}
