import { IsInt, IsString } from "class-validator";

export class CreateCourseDto {
  @IsString()
  public name: string;

  @IsInt()
  public teacherId: number;
}
