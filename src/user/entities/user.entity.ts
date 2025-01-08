import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../../role/entities/role.entity";
import { Marker } from "../../markers/entities/marker.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    login: string;

    @Column()
    password: string;

    @OneToMany(() => Role, (role) => role.user, { onDelete: 'CASCADE' })
    roles: Role[];

    @OneToMany(() => Marker, (marker) => marker.user)
    markers: Marker[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}
