import { IsString } from "class-validator";

export class ChildAttendanceDto {
  @IsString()
  public studentId: string;

  @IsString()
  public courseId: string;
}
