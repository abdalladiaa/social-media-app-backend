
export function userRevokeTokenKey(id:string , jti:string){
    return `User::${id}::RevokeToken::${jti}`
}
