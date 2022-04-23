import { Schema, model } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  mfaEnabled: boolean;
  mfaToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mfaEnabled: {
    type: Boolean,
    default: false,
  },
  mfaToken: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

const User = model<IUser>("User", UserSchema);

export default User;
