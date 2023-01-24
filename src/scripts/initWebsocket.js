import Config from "../config"

const initWebsocket = () => {
    return io(Config.WEBSOCKET_SERVER)
}

export default initWebsocket
