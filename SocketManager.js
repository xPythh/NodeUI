var events = [];
module.exports.events = events;


async function init(NodeUI, config)
{
    var Net = require("net");
    config.socket = Net.createServer().listen(config.socketPort);
    config.socketPort = config.socket.address().port;

    handleSocket(NodeUI, config);
}


function handleSocket(NodeUI, config)
{
    config.socket.on('connection', function(client) 
    {
        client.authentified = false;
        client.closeSignalSend = false;
        client.packetQueue = [];
        client.previousWarning = "";

        client.write(`ui|tag|${config.tag}<EOM>`)
        client.on('data', function(data)
        {
            var messages = data.toString().split("<EOM>");
            for (var message of messages)
            {
                var dataParts = message.toString().split("|");

                if (!client.authentified) 
                {

                    if (dataParts[0] === config.socketPassword)
                    {
                        config.socketClient = client;
                        this.authentified = true;
                        NodeUI.emit('ready');
                        NodeUI.emit('netEstablish'); // Event that will not get cleared
                    }
                    return;
                }
  
                if (dataParts[0] === "codeEvaluation")
                {
                    if (dataParts[1] === "failure")
                        NodeUI.emit("error", {
                            type: "evaluation",
                            line: parseInt(dataParts[3]),
                            message: dataParts[2]
                        });

                    if (dataParts[1] === "success")
                        NodeUI.emit('evalResult', Buffer.from(dataParts[2], 'base64').toString());
                    
                }

                if (dataParts[0] === "uiClose")
                {
                    if (!client.closeSignalSend) NodeUI.emit('close'); // Send closing signal to UI
                    closeSignalSend = true;
                    client.destroy()
                    config.socket.close();
                }

     
                var selectedEvent = events.filter(function(event){ return event.tag === dataParts[1] })[0];
                if (!selectedEvent) return;         

                if (dataParts[0] === "warning")
                {
                    if (client.previousWarning === message)
                        return;

                    client.previousWarning = message;

                    var warning = {
                        element: selectedEvent
                    };

                    if (dataParts[2] === "width")
                        if (parseInt(dataParts[3]) > selectedEvent.width)
                        {
                            warning.type = "overflow";
                            warning.message = `Overflow detected on width`;  
                            warning.requiredWidth = parseInt(dataParts[3]);
                        }

                    if (dataParts[2] === "height")
                        if (parseInt(dataParts[3]) > selectedEvent.height)
                        {
                            warning.type = "overflow";
                            warning.message = `Overflow detected on height`;    
                            warning.requiredHeight = parseInt(dataParts[3]);
                            warning.element = selectedEvent
                       }
                        
                        NodeUI.emit("warning", warning);
                }


                if (dataParts[0] === "click") selectedEvent.emit('click');

                if (dataParts[0] === "mouseEnter") selectedEvent.emit('mouseEnter');

                if (dataParts[0] === "mouseLeave") selectedEvent.emit('mouseLeave');

                if (dataParts[0] === "mouseMove") selectedEvent.emit('mouseMove', parseInt(dataParts[2]), parseInt(dataParts[3]))

                if (dataParts[0] === "move") selectedEvent.emit('move', parseInt(dataParts[2]), parseInt(dataParts[3]));

                if (dataParts[0] === "resize") selectedEvent.emit('resize', parseInt(dataParts[2]), parseInt(dataParts[3]))

                if (dataParts[0] === "notificationClosed") selectedEvent.emit('notificationClosed', dataParts[2]);

                if (dataParts[0] === "textChanged") selectedEvent.emit('textChange', parseInt(dataParts[2]), parseInt(dataParts[3]))

                if (dataParts[0] === "checkChanged") selectedEvent.emit('checkChanged', (dataParts[2] === 'True'))

            }
        });


        client.on('end', function() {  
            if (!client.closeSignalSend) NodeUI.emit('close'); // Send closing signal to UI
            client.closeSignalSend = true;
            client.destroy()
            config.socket.close();
        });

        client.on('error', function() {  
            if (!client.closeSignalSend)  NodeUI.emit('close'); // Send closing signal to UI
            client.closeSignalSend = true;
            client.destroy()
            config.socket.close();
        });

        function PacketQueurManager()
        {
            if (client.packetQueue.length > 0 && !client.closeSignalSend)
            {
                var nextPacket = client.packetQueue.join("<EOM>");
                client.packetQueue = [];
                client.write(nextPacket);
            }
        }
        setInterval(PacketQueurManager, 4);
    });
}
exports.init = init;