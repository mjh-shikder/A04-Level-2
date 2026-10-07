import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

//* Creating New Token
export const createToken = (payload: JwtPayload, secret: string, options: SignOptions) => { 
    const token = jwt.sign(payload, secret, options);

    return token
}


//* Verifying Token
export const verifyToken = (token: string, secret: Secret ) => { 
    
    const verifyingToken = jwt.verify(token, secret) 
    
    return verifyingToken

}
