export const getConfig = (): AppConfig => {
  return {
    port: parseInt(process.env.PORT as string, 10) || 3000,
    appEnv: process.env.APP_ENV as AppEnv,
    jwtSecret: process.env.JWT_SECRET as string,
    logLevel: process.env.LOG_LEVEL || 'info',
    database: {
      host: process.env.DB_HOST as string,
      port: parseInt(process.env.DB_PORT as string, 10) || 5432,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      dbName: process.env.DB_NAME as string,
      isSync: process.env.DB_SYNC === 'true',
    },
    auth: {
      resetExpiryTime: 300,
      verifyExpiryTime: 300,
      otpSecret: 'test',
    },
    cache: {
      url: process.env.REDIS_URL as string,
    },
    mail: {
      from: process.env.MAIL_FROM as string,
      transportOptions: {
        host: process.env.MAIL_HOST as string,
        port: parseInt(process.env.MAIL_PORT as string, 10),
        auth: {
          user: process.env.MAIL_AUTH_USER as string,
          pass: process.env.MAIL_AUTH_PASS as string,
        },
      },
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
      apiKey: process.env.CLOUDINARY_API_KEY as string,
      apiSecret: process.env.CLOUDINARY_API_SECRET as string,
    },
    graph: {
      apiKey: process.env.GRAPH_API_KEY as string,
      baseUrl: process.env.GRAPH_BASE_URL as string,
    },
  }
}

export interface AppConfig {
  port: number
  appEnv: AppEnv
  jwtSecret: string
  logLevel: string
  database: DbConfig
  cache: CacheConfig
  mail: MailConfig
  auth: AuthConfig
  cloudinary: CloudinaryConfig // Add this line
  graph: GraphConfig
}

export enum AppEnv {
  DEV = 'dev',
  TEST = 'test',
  PROD = 'production',
}

export interface DbConfig {
  host: string
  port: number
  user: string
  password: string
  dbName: string
  isSync: boolean
}

export interface CacheConfig {
  url: string
}

export interface MailConfig {
  from: string
  transportOptions: {
    host: string
    port: number
    auth: {
      user: string
      pass: string
    }
  }
}

export interface AuthConfig {
  resetExpiryTime: number
  verifyExpiryTime: number
  otpSecret: string
}

export interface CloudinaryConfig {
  cloudName: string
  apiKey: string
  apiSecret: string
}

export interface GraphConfig {
  apiKey: string
  baseUrl: string
}
