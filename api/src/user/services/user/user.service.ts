import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/create-user.dto';
import { PasswordService } from '../password/password.service';
import { JwtService } from '../jwt/jwt.service';
import { MailService } from 'src/global/services/mail/mail.service';
import OTPService from '../otp/otp.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly otpService: OTPService, // Inject MailService
  ) {}

  async isUserExists(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  async createUser(userDto: CreateUserDto): Promise<UserEntity> {
    const userPayload = {
      email: userDto.email.toLowerCase(),
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      passwordHash: await this.passwordService.generate(userDto.password),
      businessName: userDto.businessName.toLowerCase(),
    };

    let newUser = this.usersRepository.create(userPayload);
    newUser = await this.updateUser(newUser);

    newUser.token = this.getUserToken(newUser);

    const { otp, expiryTime } = await this.otpService.generateTimedOtp(
      newUser.email,
    );

    console.log({ otp });
    this.sendUserOtp(newUser.email, otp, expiryTime);
    return await this.updateUser(newUser);
  }

  async updateUser(newUser: UserEntity): Promise<UserEntity> {
    return await this.usersRepository.save(newUser);
  }

  async checkUserPassword(
    user: UserEntity,
    requestPassword: string,
  ): Promise<boolean> {
    return this.passwordService.compare(requestPassword, user.passwordHash);
  }

  public getUserToken(user: UserEntity): string {
    return this.jwtService.sign({
      id: user.id,
      email: user.email.toLowerCase(),
      firstName: user.firstName,
      lastName: user.lastName,
      businessName: user.businessName.toLowerCase(),
    });
  }

  private async sendUserOtp(
    email: string,
    otp: string,
    expiryTime: number,
  ): Promise<void> {
    const subject = 'Your OTP for Registration';
    const htmlContent = `
      <p>Dear user,</p>
      <p>Thank you for registering on our platform. Please use the following OTP to complete your registration:</p>
      <h3>${otp}</h3>
      <p>This OTP is valid for ${expiryTime} minutes. Do not share it with anyone.</p>
      <p>Best regards,<br>Your Team</p>
    `;

    await this.mailService.send({
      to: email,
      from: this.mailService.from(),
      subject,
      html: htmlContent,
    });
  }

  public getAll(): Promise<UserEntity[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'lastName', 'firstName', 'businessName'],
    });
  }
}
