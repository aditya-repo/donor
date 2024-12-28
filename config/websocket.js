const ws = require("ws")
const Message = require("../models/message")

const setupSocket = (io, connections)=>{
    let userid
    io.on('connection', socket=>{
        socket.on('fetchHistory', async (senderid, receiverid)=>{
            try {
                const history = await Message.find({
                    $or: [
                        {senderid, receiverid},
                        {senderid: receiverid, receiverid: senderid}
                    ]
                }).sort({createdAt: 1})

                return history
            } catch (error) {
                console.log("Fetching Message History error :",error);
                
            }
        })

        socket.on('sendMessage', async messageData=>{
            const {senderid, receiverid, body} = messageData

            const message = new Message({senderid, receiverid, body})
            await message.save()
            io.emit('receiverMessage', messageData)
        })

        socket.on('close', ()=> {
            if (userid) {
                connections.delete(userid)
                console.log(`User ${userid} disconnected.`);
            }
        })
    })
}

module.exports = setupSocket