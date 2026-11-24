import { Types } from "mongoose"
import { s3CloudProvider } from "../../lib/cloud/init.js"
import type { ICloudProvider } from "../../lib/types/interfaces/cloud.interface.js"
import userRepo from "./user.repo.js"
import type { UploadProfilePictureDto } from "./user.dto.js"

class UserService{
    private readonly cloudProvider:ICloudProvider =  s3CloudProvider
    private readonly userRepository =userRepo
    constructor(){

    }

    uploadProfilePicture = async (uploadProfilePictureDto:UploadProfilePictureDto)=>{
        const {file , userId} = uploadProfilePictureDto
      const key =   await this.cloudProvider.uploadFile(file , `/users/${userId}`)
      this.userRepository.update({_id:userId} , {profilePicture:key})
    }
}


export default new UserService()