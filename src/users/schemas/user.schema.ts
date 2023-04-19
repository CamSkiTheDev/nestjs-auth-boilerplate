import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/enums/role.enum';

export type UserDocument = HydratedDocument<User & UserSchemaMethods>;

@Schema({ _id: false })
export class Provider {
  @Prop({ required: true })
  name: string;

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: Role.User })
  roles: Role[];

  @Prop({ default: [] })
  providers: Provider[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.hashPassword = function (pass: string): string {
  return bcrypt.hashSync(pass, 12);
};

UserSchema.methods.validatePassword = function (pass: string): boolean {
  return bcrypt.compareSync(pass, this.password);
};

interface UserSchemaMethods {
  hashPassword: (password: string) => string;
  validatePassword: (password: string) => boolean;
}
