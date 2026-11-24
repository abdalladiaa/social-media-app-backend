import type { GenderEnum, ProviderEnum } from "../enum/user.enum.js";

export interface IUser{
    firstName:string,
    lastName:string,
    fullName?:string
    email:string,
    phone?:string,
    password:string,
    profilePicture?:string,
    gender?:GenderEnum,
    isVerified?:boolean,
    twoStepVerificationEnabled?:boolean,
    provider?:ProviderEnum,
}