import { createClient, RedisClientType } from "redis"

export class Redis {
    private client: RedisClientType | null = null

    private async getClient(): Promise<RedisClientType> {
        if (!this.client) {
            this.client = createClient({
                url: process.env.REDIS_URL,
            })

            this.client.on("error", (err: Error) => {
                console.error("Redis connection error: ", err.message)
            })

            await this.client.connect()
        }

        console.log("🔴 Redis client connected successfully")
        return this.client
    }

    public async getRedis<T = unknown>(
        key: string,
        options?: { array?: boolean; index?: number }
    ): Promise<T | null> {
        const client = await this.getClient()
        const raw = await client.get(key)
        if (!raw) return null

        try {
            const parsed: unknown = JSON.parse(raw)

            if (options?.array && Array.isArray(parsed) && typeof options.index === "number") {
                return parsed[options.index] as T
            }

            return parsed as T
        } catch (e) {
            console.error("Error parsing redis value: ", e)
            return null
        }
    }

    public async setRedis<T>(key: string, value: T, exp: number): Promise<"OK"> {
        const client = await this.getClient()
        const result = await client.set(key, JSON.stringify(value), {
            expiration: {
                type: "EX",
                value: exp
            }
        })

        return result as "OK"
    }
}
