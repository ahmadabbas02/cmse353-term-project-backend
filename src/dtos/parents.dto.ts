import { IsString } from "class-validator";

export class AttendanceDto {
  @IsString()
  public studentId: string;

  @IsString()
  public courseId: string;
}
