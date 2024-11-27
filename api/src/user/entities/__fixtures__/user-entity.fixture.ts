import { UserEntity } from '../user.entity';

export const mockUserEntity: UserEntity = {
  id: 'adfs9-3j2k-3j2k-3j2k',
  email: 'email',
  lastName: 'lName',
  firstName: 'fName',
  token: 'token',
  passwordHash: 'password',
  businessName: 'businessName',
  emailVerified: false,
  dateCreated: new Date(),
  dateUpdated: new Date(),
};
