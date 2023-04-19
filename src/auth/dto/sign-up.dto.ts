import { IsAlphanumeric, IsNotEmpty } from 'class-validator';
import { LoginDto } from './login.dto';

export class SignUpDto extends LoginDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;
}
