import { OtpSendEmailEnum } from "../../lib/types/enum/send-email.enum.js";
import { ProviderEnum } from "../../lib/types/enum/user.enum.js";
import otpService from "../../lib/services/otp.service.js";
import securityService from "../../lib/services/security.service.js";
import userError from "../user/user.error.js";
import type { UserRepository } from "../user/user.repo.js";
import userRepo from "../user/user.repo.js";
import type { LoginDto, RegisterDto, VerifyAccountDto } from "./auth.dto.js";
import { generateRandomUUID } from "../../utils/random/random.js";
import tokenService, { TokenServices } from "../../lib/services/token.service.js";
import { TokenTypeEnum } from "../../lib/types/enum/token.enum.js";
import type { UserPayload } from "../../lib/types/interfaces/userPayload.interface.js";
import authError from "./auth.error.js";

export class AuthService {
  private readonly userRepository: UserRepository = userRepo;
  private readonly tokenService:TokenServices = tokenService

  constructor() {}

  async register(registerDto: RegisterDto) {
    const isUserExist = await this.userRepository.findByEmail(
      registerDto.email,
    );

    if (isUserExist) throw userError.userAlreadyExists();

    registerDto.password = await securityService.hashPassword(
      registerDto.password,
    );

    if (registerDto.phone)
      registerDto.phone = securityService.encrypt(registerDto.phone);

    const user = await this.userRepository.create(registerDto);

    const code = await otpService.generateOtp();
    await otpService.createOtp(
      {
        code,
        email: user?.email!,
      },
      { emailType: OtpSendEmailEnum.VERIFY_EMAIL },
    );

    return user;
  }

  async verifyAccount(verifyAccountDto: VerifyAccountDto) {
    const { email, code } = verifyAccountDto;
    const userExist = await this.userRepository.findByEmail(email);
    if (!userExist) throw userError.userNotFound();

    if (userExist.isVerified) throw userError.emailAlreadyVerified();

    const otpExist = await otpService.getOtpByEmail(email);

    if (!otpExist) throw userError.otpExpired();

    if (otpExist !== String(code)) throw userError.invalidOtp();

    const user = await this.userRepository.updateByEmail(email, {
      isVerified: true,
    });

    if (user) await otpService.deleteOtpByEmail(user.email);
  }

  async sendOtp(email: string) {
    if (!email) throw userError.emailRequired();

    const userExist = await this.userRepository.findByEmail(email);
    if (!userExist) throw userError.userNotFound();

    if (userExist.provider === ProviderEnum.GOOGLE) {
      throw userError.googleAccount();
    }

    const code = await otpService.generateOtp();

    await otpService.createOtp(
      { email: userExist.email, code },
      { emailType: OtpSendEmailEnum.NEW_OTP },
    );
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const userExist = await this.userRepository.findByEmail(email);
    if (!userExist) throw userError.userNotFound();

    if (userExist.isVerified === false) throw userError.emailNotVerified();

    if (!password) throw userError.passwordRequired();

    if (userExist.provider === ProviderEnum.GOOGLE) {
      throw userError.googleAccount();
    }

    const matchPassword = await securityService.comparePassword(
      password,
      userExist.password,
    );
    if (!matchPassword) throw userError.passwordIncorrect();

    if (userExist.phone) {
      userExist.phone = securityService.decrypt(userExist?.phone);
    }

    if (userExist.twoStepVerificationEnabled) {
      const code = await otpService.generateOtp();
      await otpService.createOtp(
        { email, code },
        { emailType: OtpSendEmailEnum.TWO_STEP_VERIFICATION },
      );
      return;
    }

    const jti = generateRandomUUID();
    const accessToken = this.tokenService.generateToken(
      {
        id: String(userExist._id),
        email: userExist.email,
        fullName: userExist.fullName!,
        jti,
      },
      TokenTypeEnum.ACCESS_TOKEN,
    );

    const refreshToken = this.tokenService.generateToken(
      {
        id: String(userExist._id),
        email: userExist.email,
        fullName: userExist.fullName!,
        jti,
      },
      TokenTypeEnum.REFRESH_TOKEN,
    );

    return { accessToken, refreshToken };
  }

  async rotateToken(payload:UserPayload){

    const {iat , exp , ...user} = payload
    
    const refreshExpiresIn = this.tokenService.getTokenTTL(exp!)

    if(refreshExpiresIn <=0){
      throw authError.expiredRefreshToken()
    }

    const accessToken = this.tokenService.generateToken(user , TokenTypeEnum.ACCESS_TOKEN)

    const refreshToken = this.tokenService.generateToken(user , TokenTypeEnum.REFRESH_TOKEN , refreshExpiresIn)

    return {accessToken , refreshToken}
  }
}

export default new AuthService();
