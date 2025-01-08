import { IsNotEmpty } from "class-validator";

export class BoundsMarkerDto {
    @IsNotEmpty()
    lat: number;

    @IsNotEmpty()
    long: number;
}
