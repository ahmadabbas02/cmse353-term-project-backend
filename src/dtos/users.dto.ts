import { Department, UserRole } from "@/utils/consts";
import { IsArray, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsString()
  @IsNotEmpty()
  public fullName: string;
}

export class ParentUserDto extends CreateUserDto {
  @IsArray()
  public studentIds: string[];
}

export class ChairUserDto extends CreateUserDto {
  @IsString()
  @IsIn(Department.values())
  public department: string;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class ChangeRoleDto {
  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsString()
  @IsIn(UserRole.values())
  public userRole: string;

  @IsOptional()
  @IsArray()
  public studentIds?: string[];

  @IsOptional()
  @IsString()
  @IsIn(Department.values())
  public department?: string;
}
