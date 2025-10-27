import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({path:".env"})

function getGreeting(): string {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Bonjour";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Bon après-midi";
  } else {
    return "Bonsoir";
  }
}

// fonction de cryptage de password
async function cryptedPassword(password:string): Promise<string> {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

// fonction de decryptage de mot de passe
 async function decryptPassword(oldPassword: string, hashedPassword: string) : Promise<boolean> {
  const isPasswordIdentique = bcrypt.compare(oldPassword, hashedPassword);
  return isPasswordIdentique;
}

// generration du token 
function tokenify(payload:{tel:string}, tokenType : string ) : string {
  // si le token est de type refresh alors prendre REFRESH_PRIVATE_KEY sinon prendre PRIVATE_KEY
  const privateKey = tokenType !== "refresh" ? process.env.PRIVATE_KEY! : process.env.REFRESH_PRIVATE_KEY!;
  // si le token est de type refresh donc la duree est 2 jours sinon 5minutes pour juste la simulation(vous pouvez changer en fonction de votre logique)
  const expTime = tokenType !== "refresh" ? '5m' : '2 days'; 

  // signer le token avec la methode sign de jsonwebtoken
  const token = jwt.sign(payload, privateKey , { algorithm: 'HS256', expiresIn: expTime});
  return token;
}

function getPayloadFromToken(token : string, isRefreshToken = false):JwtPayload|"Token expire"|undefined{
  try {
    const key = !isRefreshToken ? process.env.PRIVATE_KEY! : process.env.REFRESH_PRIVATE_KEY!;
    const payload = jwt.verify(token, key) as JwtPayload;
    
    // verifier que le token n'a pas expire
    if (payload.exp && Date.now() >= payload.exp * 1000 ) {
      console.log('Le token a expire');
      return "Token expire";
    } 
    return payload;
  } catch (error : any) {

    if (error.name === "TokenExpiredError") {
      return "Token expire";
    }
    return undefined;
  }
}

// Génération de OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


export {
    getGreeting,
    cryptedPassword,
    decryptPassword,
    tokenify,
    getPayloadFromToken,
    generateOTP
}