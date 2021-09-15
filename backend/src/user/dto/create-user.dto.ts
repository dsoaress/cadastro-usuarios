import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  code!: string

  @IsNotEmpty()
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  image?: string

  @IsNotEmpty()
  @IsString()
  birthDate!: string
}
