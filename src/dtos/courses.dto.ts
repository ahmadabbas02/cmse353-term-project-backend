import { IsDateString, IsString } from "class-validator";

export class CreateCourseDto {
  @IsString()
  public name: string;

  @IsString()
  public teacherId: string;
}

export class AddAttendanceRecordDto {
  @IsString()
  public courseId: string;

  @IsDateString()
  public dateTime: string;
}

export class UpdateAttendanceRecordDto {
  @IsString()
  public attendanceRecordId: string;
}

export class AddStudentToCourseDto {
  @IsString()
  public studentId: string;

  @IsString()
  public courseId: string;
}
