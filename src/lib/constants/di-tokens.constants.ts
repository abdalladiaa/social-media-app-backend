export const CONTAINER_TOKENS = {
  services: {
    userService: Symbol("UserService"),
    authService: Symbol("AuthService"),
    postService: Symbol("PostService"),
  },

  controllers: {
    userController: Symbol("UserController"),
    authController: Symbol("AuthController"),
    postController: Symbol("PostController"),
  },

  repositories: {
    userRepository: Symbol("UserRepository"),
    AuthRepository: Symbol("AuthRepository"),
    postRepository: Symbol("PostRepository"),
  },

  utils: {
    cacheProvider: Symbol("CacheProvider"),
    cloudProvider: Symbol("CloudProvider"),
    notificationProvider: Symbol("NotificationProvider"),
    otpService: Symbol("OtpService"),
    securityService: Symbol("SecurityService"),
    tokenService: Symbol("TokenService"),
  },
};
