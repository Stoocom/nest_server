import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, Point, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Marker {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @Column()
    rating: string;

    @Column({ type: 'double precision' })
    lat: number;

    @Column({ type: 'double precision' })
    long: number;

    @Column()
    smallImageLink: string;

    @Column()
    originImageLink: string;

    @ManyToOne(() => User, (user) => user.markers)
    @JoinColumn({ name: 'user_id'})
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}
