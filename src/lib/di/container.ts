import { container } from "tsyringe";
import { UserService } from "../../modules/user/user.service.js";
import { CONTAINER_TOKENS } from "../constants/di-tokens.constants.js";
import { AuthService } from "../../modules/auth/auth.service.js";
import { UserController } from "../../modules/user/user.controller.js";
import { AuthController } from "../../modules/auth/auth.controller.js";
import { UserRepository } from "../../modules/user/user.repo.js";
import { PostRepository } from "../../modules/post/post.repo.js";
import { PostService } from "../../modules/post/post.service.js";
import { PostController } from "../../modules/post/post.controller.js";
import { s3CloudProvider } from "../cloud/init.js";
import cacheClient from "../cache/init.js";
import sendNotificationClient from "../notification/init.js";
import otpService from "../services/otp.service.js";
import securityService from "../services/security.service.js";
import tokenService from "../services/token.service.js";


// services
container.registerSingleton(CONTAINER_TOKENS.services.userService ,UserService)
container.registerSingleton(CONTAINER_TOKENS.services.authService ,AuthService)
container.registerSingleton(CONTAINER_TOKENS.services.postService, PostService)

// controllers
container.registerSingleton(CONTAINER_TOKENS.controllers.userController, UserController)
container.registerSingleton(CONTAINER_TOKENS.controllers.authController, AuthController)
container.registerSingleton(CONTAINER_TOKENS.controllers.postController, PostController)

// repositories
container.registerSingleton(CONTAINER_TOKENS.repositories.userRepository, UserRepository)
container.registerSingleton(CONTAINER_TOKENS.repositories.postRepository, PostRepository)

// utils
container.registerInstance(CONTAINER_TOKENS.utils.cloudProvider ,s3CloudProvider)
container.registerInstance(CONTAINER_TOKENS.utils.cacheProvider ,cacheClient)
container.registerInstance(CONTAINER_TOKENS.utils.notificationProvider ,sendNotificationClient)
container.registerInstance(CONTAINER_TOKENS.utils.otpService, otpService)
container.registerInstance(CONTAINER_TOKENS.utils.securityService, securityService)
container.registerInstance(CONTAINER_TOKENS.utils.tokenService, tokenService)
export default container