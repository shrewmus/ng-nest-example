import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePollDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  optionA!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  optionB!: string;
}
