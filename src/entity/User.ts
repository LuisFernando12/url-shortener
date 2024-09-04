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

  @Column({type: "varchar"})
  name: string;

  @Column({type: "varchar"})
  email: string;

  @Column({type: "varchar"})
  password: number;

  @CreateDateColumn()
  createdAt: Date;
  @OneToMany(() => Url, url => url.userId )
  urls: Url;
}
