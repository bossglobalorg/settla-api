import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from '../../dto/create-user.dto'
import { UserService } from '../user/user.service'
import { LoginDto } from '../../dto/login.dto'
import { UserEntity } from '../../entities/user.entity'
import { Business } from '@features/business/entities/business.entity'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(userDto: CreateUserDto): Promise<UserEntity> {
    // check if user exists and send custom error message
    if (await this.userService.isUserExists(userDto.email)) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
    }

    return await this.userService.createUser(userDto)
  }

  async login(loginRequest: LoginDto): Promise<{
    token: string
    user: UserEntity
    business: Business | null
  } | void> {
    const { email, password } = loginRequest
    const user = await this.userService.isUserExists(email)

    if (!user) {
      return this.failLogin()
    }

    if (!user.emailVerified) {
      this.failLogin('Please verify your email before logging in')
    }

    if (await this.userService.checkUserPassword(user, password)) {
      const token = this.userService.getUserToken(user)
      const business = await this.userService.getUserBusiness(user)
      user.token = token
      await this.userService.updateUser(user)

      return { token, user, business }
    }

    this.failLogin('Incorrect password')
  }

  async verifyOtp(email: string, otp: string): Promise<string> {
    return this.userService.verifyOtpAndGenerateToken(email, otp)
  }

  private failLogin(message = 'Login failed') {
    throw new HttpException(message, HttpStatus.BAD_REQUEST)
  }
}
