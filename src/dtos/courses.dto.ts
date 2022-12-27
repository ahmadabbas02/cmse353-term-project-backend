import { IsBoolean, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public teacherId: string;
}

export class AddAttendanceRecordDto {
  @IsString()
  @IsNotEmpty()
  public courseId: string;

  @IsDateString()
  public dateTime: string;
}

export class UpdateAttendanceRecordDto {
  @IsString()
  @IsNotEmpty()
  public attendanceRecordId: string;

  @IsBoolean()
  public isPresent: boolean;
}

export class AddStudentToCourseDto {
  @IsString()
  @IsNotEmpty()
  public studentId: string;

  @IsString()
  @IsNotEmpty()
  public courseId: string;
}
