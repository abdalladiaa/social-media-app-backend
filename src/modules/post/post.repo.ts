import Post from "../../DB/model/post.model.js";
import type { IPost } from "../../lib/types/interfaces/post.interface.js";
import Repository from "../../lib/repository/repository.js";

 class PostRepository extends Repository<IPost>{
    constructor(){
        super(Post)
    }
}


export default new PostRepository()