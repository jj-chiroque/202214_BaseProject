import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StoreEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    city: string;

    @Column()
    address: string;

}
