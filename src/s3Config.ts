import Config from "./config";

export const s3Config = {
  Auth: {
    identityPoolId: Config.AWS.IDENTITY_POOL_ID,
    region: Config.AWS.REGION
  },
  Storage: {
    AWSS3: {
      bucket: Config.AWS.BUCKET,
      region: Config.AWS.REGION
    }
  }
}