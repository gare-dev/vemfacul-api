import IORedis from "ioredis"
import { Queue } from "bullmq"

const connection = new IORedis(process.env.IOREDIS_URL ?? "", { maxRetriesPerRequest: null })


export const notificationQueue = new Queue("notificationsQueue", { connection }) 
