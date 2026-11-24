import {
  NotFoundException,
  UnAuthorizedException,
} from "../../lib/error/exception.error.js";

const authError = {
  invalidAccessToken: () => new UnAuthorizedException("Invalid access token"),

  expiredAccessToken: () => new UnAuthorizedException("Access token expired"),

  invalidRefreshToken: () => new UnAuthorizedException("Invalid refresh token"),

  expiredRefreshToken: () => new UnAuthorizedException("Refresh token expired"),

  unauthorized: () => new UnAuthorizedException("Unauthorized"),

  idNotFound: () => new NotFoundException("Id not found"),

  tokenRevoked: () =>
    new UnAuthorizedException("Token has been revoked, please login again"),
};

export default authError;
