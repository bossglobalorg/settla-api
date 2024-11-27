import { UserEntity } from '../user.entity';

export const mockUserEntity: UserEntity = {
  id: 'adfs9-3j2k-3j2k-3j2k',
  email: 'email',
  lastName: 'lName',
  firstName: 'fName',
  token: 'token',
  passwordHash: 'password',
  businessName: 'businessName',
  emailVerificationToken: 'test-token',
  emailVerified: false,
  emailVerificationTokenExpiresAt: new Date(),
  dateCreated: new Date(),
  dateUpdated: new Date(),
};
