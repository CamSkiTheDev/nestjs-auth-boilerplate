import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { Provider } from '../schemas/user.schema';

export class CreateUserDto extends SignUpDto {
  providers?: Provider[];
}
