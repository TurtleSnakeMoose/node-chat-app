const buildMessageObject = (message, username) => {
    return {
        message,
        username,
        timestamp: new Date().getTime()
    }
}

const buildLocationMessageObject = (location_link, username) => {
    return {
        location_link,
        username,
        timestamp: new Date().getTime()
    }
}

module.exports = {
    buildMessageObject,
    buildLocationMessageObject
}