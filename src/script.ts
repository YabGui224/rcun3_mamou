import dotenv from 'dotenv';
dotenv.config({path:".env"})
import { PrismaClient } from "./generated/prisma/client";
import Redis from 'ioredis';

export const prisma = new PrismaClient({
    log : ['query']
});

export const redisClient = new Redis({
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!)
});