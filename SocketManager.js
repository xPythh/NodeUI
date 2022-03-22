var events = [];

module.exports.events = events;

var packetQueueManagerInterval;

async function init(NodeUI, config)
{
    events.push(NodeUI); // Add events directly for UI

    var Net = require("net");
    config.socket = Net.createServer().listen(config.socketPort);
    config.socketPort = config.socket.address().port;
    config.packetQueue = [];

    handleSocket(NodeUI, config);
}


function handleSocket(NodeUI, config)
{
    config.socket.on('connection', function(client) 
    {
        client.authentified = false;
        client.closeSignalSend = false;
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
                        packetQueueManagerInterval = setInterval(PacketQueurManager, 4);
                        NodeUI.emit('ready');
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

                if (dataParts[0] === "close")
                    destroySocket(client, NodeUI, config);
                

     
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


        client.on('end', function() { destroySocket(client, NodeUI, config); });
        client.on('error', function() { destroySocket(client, NodeUI, config); });

        function PacketQueurManager()
        {
            if (config.packetQueue.length > 0)
            {
                var nextPacket = config.packetQueue.join("<EOM>");
                config.packetQueue = [];
                client.write(nextPacket);
            }
        }
    });
}
exports.init = init;


function destroySocket(client, NodeUI, config)
{
    if (!client.closeSignalSend)  NodeUI.emit('close'); // Send closing signal to UI
    client.closeSignalSend = true;
    clearInterval(packetQueueManagerInterval);
    config.socket.close();
    return;
}