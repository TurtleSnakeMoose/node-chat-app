const users = []

const addUser = ({ id, username, room }) => {
    // prepare data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }
    
    // check for existing user
    const matchingUser = users.find( user => user.username === username && user.room === room );
    if (matchingUser) {
        return {
            error: 'username already exists in this room'
        }
    }

    // store user
    const user = {id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex( users => users.id === id )

    if (index > -1) {
        return users.splice(index, 1)[0]
    }
}    

const getUser = id => users.find(user => user.id === id)

const getUsersInRoom = room => users.filter(user => user.room === room)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}