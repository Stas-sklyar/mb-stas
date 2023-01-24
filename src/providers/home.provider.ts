import axios, { AxiosResponse } from "axios"
import Config from "../config"

const HomeProvider = {
  createModel: async (modelName: string): Promise<string> => {
    return new Promise(async (
      resolve: (value: string | PromiseLike<string>) => void,
      reject: (reason?: any) => void
    ) => {
      try {
        const response: AxiosResponse<any, any> = await axios.post(`${Config.API_URL}/Model/${modelName}`)
        resolve(response.data.idModel)
      } catch (err) {
        reject(err)
      }
    })
  }
}

export default HomeProvider