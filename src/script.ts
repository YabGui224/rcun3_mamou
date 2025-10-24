import dotenv from 'dotenv';
dotenv.config({path:".env"})
import { PrismaClient } from "./generated/prisma/client";

export const prisma = new PrismaClient({
    log : ['query']
});