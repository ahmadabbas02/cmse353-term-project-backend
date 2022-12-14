import { IsArray, IsEmail, IsString } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public fullName: string;
}

export class ParentUserDto extends CreateUserDto {
  @IsArray()
  public studentIds: string[];
}

export class ChairUserDto extends CreateUserDto {
  @IsString()
  public department: string;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
