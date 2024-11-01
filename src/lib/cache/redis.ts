import { createClient, type RedisClientType } from "redis";
import { APP_NAME } from "../../consts/main";

type RedisConfig = {
  host: string;
  port: number;
  password?: string;
  tls?: boolean; // Add TLS support
};

class RedisManager {
  private clients: RedisClientType[] = [];
  private currentClientIndex: number = 0;
  private appendKey: string = "";

  constructor(configs: (RedisConfig | string)[], appendKey?: string) {
    this.appendKey = appendKey || "";
    this.clients = configs.map((config) => {
      if (typeof config === "string") {
        return createClient({
          url: config,
          pingInterval: 3000,
        });
      } else {
        // Use RedisConfig object (support optional TLS)
        return createClient({
          socket: {
            host: config.host,
            port: config.port,
            tls: config.tls ? true : undefined,
          },
          password: config.password,
        });
      }
    });

    this.clients.forEach((client, index) => {
      client.on("error", (err: any) => {
        console.error(
          `Redis client ${index} error:`,
          this.extractErrorInfo(err)
        );
      });
    });
  }

  private extractErrorInfo(err: any): string {
    if (err && err.message) {
      return err.message.split("\n")[0];
    }
    return "Unknown error";
  }

  private async connect(client: RedisClientType): Promise<void> {
    try {
      if (!client.isOpen) {
        await client.connect();
      }
    } catch (err) {
      const errMsg = this.extractErrorInfo(err);
      console.error(
        `Error connecting to Redis client ${this.currentClientIndex}: ${errMsg}`
      );
      throw new Error(errMsg);
    }
  }

  private async getClient(): Promise<RedisClientType | null> {
    const totalClients = this.clients.length;

    for (let attempts = 0; attempts < totalClients; attempts++) {
      const client = this.clients[this.currentClientIndex];
      try {
        console.log(`Trying Redis client ${this.currentClientIndex}`);
        await this.connect(client);
        return client;
      } catch (err) {
        const errMsg = this.extractErrorInfo(err);
        console.error(
          `Redis client ${this.currentClientIndex} failed: ${errMsg}`
        );
        this.currentClientIndex = (this.currentClientIndex + 1) % totalClients; // Move to next client
      }
    }

    return null; // If all clients fail, return null
  }

  private async handleAction<T>(
    action: (client: RedisClientType) => Promise<T>
  ): Promise<T> {
    const client = await this.getClient();
    if (client) {
      try {
        return await action(client);
      } catch (err) {
        const errMsg = this.extractErrorInfo(err);
        console.error(
          `Action failed on Redis client ${this.currentClientIndex}: ${errMsg}`
        );
      }
    }
    throw new Error("All Redis clients have failed");
  }

  public async get(key: string): Promise<string | null> {
    return await this.handleAction((client) =>
      client.get(`${key}-${this.appendKey}`)
    );
  }

  public async set(key: string, value: string, ttl: number): Promise<void> {
    await this.handleAction((client) =>
      client.set(`${key}-${this.appendKey}`, value, { EX: ttl })
    );
  }

  public async del(key: string): Promise<void> {
    await this.handleAction((client) => client.del(`${key}-${this.appendKey}`));
  }

  public async flushall(): Promise<void> {
    await this.handleAction((client) => client.flushAll());
  }
}

export const redisManager = new RedisManager(
  [import.meta.env.RENDER_REDIS_URL, ,],
  APP_NAME
);
