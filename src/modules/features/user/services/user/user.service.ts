import { MailService } from 'src/modules/providers/mail/mail.service'
import { Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Business } from '@features/business/entities/business.entity'
import { PartnerReference } from '@global/entities/partner-reference.entity'
import { PartnerEntityType, PartnerName } from '@global/enums/partner-reference.enum'

import { CreateUserDto } from '../../dto/create-user.dto'
import { UserEntity } from '../../entities/user.entity'
import { JwtService } from '../jwt/jwt.service'
import { OTPService } from '../otp/otp.service'
import { PasswordService } from '../password/password.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly otpService: OTPService,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(PartnerReference)
    private partnerReferenceRepository: Repository<PartnerReference>,
  ) {}

  async isUserExists(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({
      where: {
        email: email.toLowerCase(),
      },
    })
  }

  async createUser(userDto: CreateUserDto): Promise<UserEntity> {
    const userPayload = {
      email: userDto.email.toLowerCase(),
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      passwordHash: await this.passwordService.generate(userDto.password),
      businessName: userDto.businessName,
      idCountry: userDto.country,
    }

    let newUser = this.usersRepository.create(userPayload)
    newUser = await this.updateUser(newUser)

    const { otp, expiryTime } = await this.otpService.generateTimedOtp(newUser.email)

    this.sendUserOtp(newUser.email, otp, expiryTime)
    return await this.updateUser(newUser)
  }

  async updateUser(newUser: UserEntity): Promise<UserEntity> {
    return await this.usersRepository.save(newUser)
  }

  async checkUserPassword(user: UserEntity, requestPassword: string): Promise<boolean> {
    return this.passwordService.compare(requestPassword, user.passwordHash)
  }

  async getUserEntityId(
    userId: string,
    partnerName: PartnerName,
    entityType: PartnerEntityType,
  ): Promise<PartnerReference> {
    try {
      const partnerReference = await this.partnerReferenceRepository.findOne({
        where: { entity_id: userId, partner_name: partnerName, entity_type: entityType },
      })

      if (!partnerReference) {
        throw new HttpException(
          {
            message: 'Failed to fetch owner businesses',
            errors: 'User entity not found',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      }

      return partnerReference
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to fetch owner businesses',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  public getUserToken(user: UserEntity): string {
    return this.jwtService.sign({
      id: user.id,
      email: user.email.toLowerCase(),
      firstName: user.firstName,
      lastName: user.lastName,
      businessName: user.businessName.toLowerCase(),
    })
  }

  public async getUserBusiness(user: UserEntity): Promise<Business | null> {
    return this.businessRepository.findOne({
      where: {
        owner_id: user.id,
      },
    })
  }

  private async sendUserOtp(email: string, otp: string | null, expiryTime: number): Promise<void> {
    const subject = 'Your OTP for Registration'
    const htmlContent = `
      <p>Dear user,</p>
      <p>Thank you for registering on our platform. Please use the following OTP to complete your registration:</p>
      <h3>${otp}</h3>
      <p>This OTP is valid for ${expiryTime} minutes. Do not share it with anyone.</p>
      <p>Best regards,<br>Your Team</p>
    `

    await this.mailService.send({
      to: email,
      from: this.mailService.from(),
      subject,
      html: htmlContent,
    })
  }

  async verifyOtpAndGenerateToken(email: string, submittedOtp: string): Promise<string> {
    const user = await this.isUserExists(email)

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND)
    }

    try {
      // Test OTP flow to debug

      // Verify the submitted OTP
      const isValid = await this.otpService.verifyTimedOtp(email, submittedOtp)

      if (!isValid) {
        throw new HttpException('OTP Verification failed', HttpStatus.BAD_REQUEST)
      }

      const user = await this.usersRepository.findOne({ where: { email } })
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND)
      }

      user.emailVerified = true
      await this.usersRepository.save(user)

      return this.getUserToken(user)
    } catch (error) {
      console.error('OTP Verification Error:', error)
      throw new HttpException(error.message || 'OTP Verification failed', HttpStatus.BAD_REQUEST)
    }
  }

  public getAll(): Promise<UserEntity[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'lastName', 'firstName', 'businessName'],
    })
  }

  private failVerifyOtp(message = 'OTP Verification failed') {
    throw new HttpException(message, HttpStatus.BAD_REQUEST)
  }
}
