import { OtpSendEmailEnum } from "../../lib/types/enum/send-email.enum.js";
import { ProviderEnum } from "../../lib/types/enum/user.enum.js";
import type { OtpService } from "../../lib/services/otp.service.js";
import type { SecurityService } from "../../lib/services/security.service.js";
import userError from "../user/user.error.js";
import type { UserRepository } from "../user/user.repo.js";
import type { LoginDto, RegisterDto, VerifyAccountDto } from "./auth.dto.js";
import { generateRandomUUID } from "../../utils/random/random.js";
import type { TokenServices } from "../../lib/services/token.service.js";
import { TokenTypeEnum } from "../../lib/types/enum/token.enum.js";
import type { UserPayload } from "../../lib/types/interfaces/userPayload.interface.js";
import authError from "./auth.error.js";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnAuthorizedException,
} from "../../lib/error/exception.error.js";
import { inject, injectable } from "tsyringe";
import { CONTAINER_TOKENS } from "../../lib/constants/di-tokens.constants.js";
import AppError from "../../pkg/error/error.js";
import type { ICacheProvider } from "../../lib/types/interfaces/cach.interface.js";
import { userRevokeTokenKey } from "../../utils/cache/userRevokeTokenKey.js";

@injectable()
export class AuthService {
  constructor(
    @inject(CONTAINER_TOKENS.repositories.userRepository)
    private readonly userRepository: UserRepository,
    @inject(CONTAINER_TOKENS.utils.otpService)
    private readonly otpService: OtpService,
    @inject(CONTAINER_TOKENS.utils.securityService)
    private readonly securityService: SecurityService,
    @inject(CONTAINER_TOKENS.utils.tokenService)
    private readonly tokenService: TokenServices,
    @inject(CONTAINER_TOKENS.utils.cacheProvider)
    private readonly cacheProvider: ICacheProvider,
  ) {}

  async register(registerDto: RegisterDto) {
    const isUserExist = await this.userRepository.findByEmail(
      registerDto.email,
    );

    if (isUserExist) throw new ConflictException(userError.userAlreadyExists);

    const user = await this.userRepository.create(registerDto);

    const code = await this.otpService.generateOtp();
    await this.otpService.createOtp(
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
    if (!userExist) throw new NotFoundException(userError.userNotFound);

    if (userExist.isVerified)
      throw new ConflictException(userError.emailAlreadyVerified);

    const otpExist = await this.otpService.getOtpByEmail(email);

    if (!otpExist) throw new BadRequestException(userError.otpExpired);

    if (otpExist !== String(code))
      throw new BadRequestException(userError.invalidOtp);

    const user = await this.userRepository.updateByEmail(email, {
      isVerified: true,
    });

    if (user) await this.otpService.deleteOtpByEmail(user.email);
  }

  async sendOtp(email: string) {
    if (!email) throw new BadRequestException(userError.emailRequired);

    const userExist = await this.userRepository.findByEmail(email);
    if (!userExist) throw new NotFoundException(userError.userNotFound);

    if (userExist.provider === ProviderEnum.GOOGLE) {
      throw new BadRequestException(userError.googleAccount);
    }

    const code = await this.otpService.generateOtp();

    await this.otpService.createOtp(
      { email: userExist.email, code },
      { emailType: OtpSendEmailEnum.NEW_OTP },
    );
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const userExist = await this.userRepository.findByEmail(email, {
      password: 1,
    });
    if (!userExist) throw new NotFoundException(userError.userNotFound);

    if (userExist.isVerified === false)
      throw new ForbiddenException(userError.emailNotVerified);

    if (!password) throw new BadRequestException(userError.passwordRequired);

    if (userExist.provider === ProviderEnum.GOOGLE) {
      throw new BadRequestException(userError.googleAccount);
    }

    const matchPassword = await this.securityService.comparePassword(
      password,
      userExist.password!,
    );
    if (!matchPassword)
      throw new UnAuthorizedException(userError.passwordIncorrect);

    if (userExist.phone) {
      userExist.phone = this.securityService.decrypt(userExist?.phone);
    }

    if (userExist.twoStepVerificationEnabled) {
      const code = await this.otpService.generateOtp();
      await this.otpService.createOtp(
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

  async rotateToken(payload: UserPayload) {
    const { iat, exp, ...user } = payload;

    const refreshExpiresIn = this.tokenService.getTokenTTL(exp!);

    if (refreshExpiresIn <= 0) {
      throw new UnAuthorizedException(authError.expiredRefreshToken);
    }

    const accessToken = this.tokenService.generateToken(
      user,
      TokenTypeEnum.ACCESS_TOKEN,
    );

    const refreshToken = this.tokenService.generateToken(
      user,
      TokenTypeEnum.REFRESH_TOKEN,
      refreshExpiresIn,
    );

    return { accessToken, refreshToken };
  }

  async logInWithGoogle(idToken: string) {
    const payload = await this.securityService.verifyGoogleToken(idToken);

    if (!payload) {
      throw new UnAuthorizedException(userError.invalidGoogleToken);
    }

    if (!payload.email) {
      throw new UnAuthorizedException(userError.invalidGoogleToken);
    }

    const userExist = await this.userRepository.findByEmail(payload.email);
    const jti = generateRandomUUID();
    if (userExist) {
      const accessToken = this.tokenService.generateToken(
        {
          id: userExist._id,
          email: userExist.email,
          fullName: userExist.fullName!,
          jti,
        },
        TokenTypeEnum.ACCESS_TOKEN,
      );
      const refreshToken = this.tokenService.generateToken(
        {
          id: userExist._id,
          email: userExist.email,
          fullName: userExist?.fullName,
          jti,
        },
        TokenTypeEnum.REFRESH_TOKEN,
      );
      return {
        accessToken,
        refreshToken,
      };
    }

    const [firstName = "", lastName = ""] = payload?.name?.split(" ") ?? [];
    const createdUser = await this.userRepository.create({
      firstName,
      lastName,
      email: payload.email,
      isVerified: true,
      provider: ProviderEnum.GOOGLE,
    });
    if (!createdUser) throw new AppError("User creation failed", 500);

    const fullName = `${firstName} ${lastName}`;
    const accessToken = this.tokenService.generateToken(
      {
        id: createdUser._id,
        email: createdUser.email,
        fullName,
        jti,
      },
      TokenTypeEnum.ACCESS_TOKEN,
    );
    const refreshToken = this.tokenService.generateToken(
      {
        id: createdUser._id,
        email: createdUser.email,
        fullName,
        jti,
      },
      TokenTypeEnum.REFRESH_TOKEN,
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async revokeToken(payload: UserPayload) {
    if (!payload) throw new UnAuthorizedException(authError.unauthorized);
    const { id, jti, exp } = payload;

    const ttl = this.tokenService.getTokenTTL(exp as number);
    return await this.cacheProvider.set(
      userRevokeTokenKey(id as string, jti),
      jti,
      ttl,
    );
  }
}
