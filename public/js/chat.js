const socket = io();

// jquery mode
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// elements
const form = $('form')
const txt_msg = $('#txt_msg')
const btn_send = $('#btn_send')
const btn_sendloc = $('#btn_sendloc')
const div_msgBoard = $('#div_msgBoard')
const div_sidebar = $('#sidebar')

// html templates
const template_message = $('#template_message').innerHTML
const template_location_url = $('#template_location_url').innerHTML
const template_sidebar = $('#template_sidebar').innerHTML

//options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoScroll = () => {
    const latestMsg = div_msgBoard.lastElementChild

    const latestMsgStyles = getComputedStyle(latestMsg)
    const latestMsgMargin = parseInt(latestMsgStyles.marginBottom)
    const latestMsgHeight = latestMsg.offsetHeight + latestMsgMargin

    const msgBoardVisibleHeight = div_msgBoard.offsetHeight
    const contentHeight = div_msgBoard.scrollHeight

    const scrollOffset = div_msgBoard.scrollTop + msgBoardVisibleHeight

    if (contentHeight - latestMsgHeight <= scrollOffset) {
        div_msgBoard.scrollTop = div_msgBoard.scrollHeight
    }
}

form.addEventListener('submit', e => {
    e.preventDefault()
    socket.emit('sendMessage', txt_msg.value, error => {

        btn_send.removeAttribute('disabled');
        txt_msg.value = ''
        txt_msg.focus()

        if (error) {
            return console.log(error)
        }
        console.log('message delivered!')
    })
})

socket.on('msg', msgObj => {
    const html = Mustache.render( 
        template_message, 
        { 
            username: msgObj.username,
            msg: msgObj.message, 
            timestamp: moment(msgObj.timestamp).format('kk:mm:ss')
        });
    div_msgBoard.insertAdjacentHTML('beforeend', html)
    autoScroll()
    console.log(msgObj)
})

btn_sendloc.addEventListener('click', e => {
    btn_sendloc.setAttribute('disabled','disabled')    
    if (!navigator.geolocation) {
        return  alert('Geolocation isnt supported by your browser')
    }

    navigator.geolocation.getCurrentPosition( position => {
        socket.emit(
            'sendLocation', 
            {lat: position.coords.latitude, long: position.coords.longitude}, 
            error => {
                if (error) {
                    return console.log(error)
                }
                btn_sendloc.removeAttribute('disabled')    
                console.log('location shared successfuly')
        })
    })
})

socket.on('locationMsg', locationMsgObj => {
    const html = Mustache.render(
        template_location_url, 
        {
            username: locationMsgObj.username,
            location_link: locationMsgObj.location_link, 
            timestamp: moment(locationMsgObj.timestamp).format('kk:mm:ss')
        }
    )

    div_msgBoard.insertAdjacentHTML('beforeend', html)
    autoScroll()
    console.log(locationMsgObj)
})


socket.emit('join', {username, room}, error => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(template_sidebar, {
        room,
        users
    })
    div_sidebar.innerHTML = html
})