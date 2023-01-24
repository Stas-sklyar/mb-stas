import Config from "../config"

const initWebsocket = () => {
    // eslint-disable-next-line no-undef
    return io(Config.WEBSOCKET_SERVER)
}

export default initWebsocket
