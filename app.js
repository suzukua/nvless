"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('http');
const https = require('https');
const express = require('express');
const ws = require("ws");
const net = require("net");
const dgram = require("dgram");
const utils = require("./src/utils");
const types = require("./src/types");
const stream = require("stream");
const os = require("os");

const sslOptions = {
    key: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDOUhXInxuF+BlR
5mY/p/Ml2zWRG4ThlV284ua7a+dMdeSuTXVG+XIsp8SSYzv/DK7IGfYUs/dKJOKT
kiSdA3V8jhQOJ1tVRncljOBK947XBVUpaIfcxrD3GrGKBh8eXBhtd5lK3nG+3hL3
VWmEPp2eWcdb/UqSWOIugaEEbHqMQfWtYBq0tkZOH/3UavfQVM4MLuND0ER9r9hZ
iOOrGCD02p8VIfZ4Weoj+pJIbHUtGWoeFuJ5MdXn7PyhAMQVoApVEhFbHTaCNc5Z
OBT0iE8Y9cT+c1+JeGuV1k3Gqpv3vliIaartL08/3Aj5BqXtCWb6wszIi8C7El1r
TxujMs5NAgMBAAECggEAMU8+847LNi6AZqmJAGe0XfTRDZglHwDiwVT9TgfQ5N48
REgw4kCVwARsn4vl9+PhFePWg0YrsOW13Q0NgRUljBoswuE3G99WdHwB0wjtc4hL
vTTFW8eE3dncWp9x6oCaOfdehJ07VCGhKMmaCUgpxYGxetPDccyaagEDKZp/g2uF
7C3/HSuX/P150DWWNdjmEOSXqKqFDTxI7KIWuf7mpGToUh+7vrqC6tUfPZlMv6nP
HSebbghNRX5WQRJWoG/kreXYRUwhm4vwmcknRBkrnef46G26MiktFaF7Nz7fPyNQ
kW9Y68yjhNFT4VkdYcSDmaRL/VLOeS7ieF/I9KDeoQKBgQD7q9uPOpLr3EN+BAcv
ykvGyLln2g5SnEPbSVgUvr88WrXuTrH3xGdWDGqZ4QL2r0Cnt3ummO/oziyzioow
wibV35uotICxaVsK4jWv+/6WB2HViDWci8+l+sUIQCmwOf/xqtdqJP0MuYbl2kMT
2DjTHbTpoislM9KeSa5Y11eNOQKBgQDR3orZUnFUQdFnnQNkdrHEkOdPjqj1h4Gw
6q4t3ZgvD8vt966L6OHllC/IgOZ5EN7X1CZtpm+ad6e9lTgxxVoI1uX8/Sn7H8q6
N/DfXmvAkcXFpZBWxwOss0OZGRf/w0JJ02xDYNvb5EgmAIb0R4yL+6cBmv83KI+Y
DEtn5jCdtQKBgQD2QLy/MvMbshSgM1TM4EaxJSq1gVnOX3TOFsAG3HXGmoO1wG7H
Hvh17ARKuS7rLaQ394MYCkGFLGf07bQ17WOOlhN7SdM6xPn+dkVOA2aiamrCQ1sh
6HOv1uYAIrgn5TiYwS+yfqrUTpy+P4iu3D0N5d1lVfadmk2V8EaWS28xkQKBgCqT
GdnSdrkgDQoW+Sw1RATbXIFwMGh2z+GDCki1rnzFmJoy587sNH9tW3Aybg7bVEm2
eQE/hV5xra6xCdBW99fZOJjlBtIx9d9nH89AiV1sdRGOb8Sa5OzxBOKXC55QDy+I
22qjyJZILja/XqFJroJrT8rslZ+r881lmRp/wRcNAoGBALONp4l5uPbWb3m0vbt0
4olRB4ImUjUyLEcgXTV68PlAyDoyois1PNfJGvGYlvyyO0T1oyHj+m/qdMhKDe6u
YtY6QaabooIMM6L+fnh4haBLByNB9b00gd5LtV3cgbVY3XyZbn+n2kEp7V7bFHjD
Wkjfu+NaYptpukDEgQDMLa4e
-----END PRIVATE KEY-----`,
    cert: `-----BEGIN CERTIFICATE-----
MIIDbTCCAlWgAwIBAgIUXwpZpqZJDGUYp1IlzQv5ISX9iVkwDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM
GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAgFw0yNTA0MDcwNjM1MDVaGA8zMDI0
MDgwODA2MzUwNVowRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUx
ITAfBgNVBAoMGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBAM5SFcifG4X4GVHmZj+n8yXbNZEbhOGVXbzi5rtr
50x15K5NdUb5ciynxJJjO/8MrsgZ9hSz90ok4pOSJJ0DdXyOFA4nW1VGdyWM4Er3
jtcFVSloh9zGsPcasYoGHx5cGG13mUrecb7eEvdVaYQ+nZ5Zx1v9SpJY4i6BoQRs
eoxB9a1gGrS2Rk4f/dRq99BUzgwu40PQRH2v2FmI46sYIPTanxUh9nhZ6iP6kkhs
dS0Zah4W4nkx1efs/KEAxBWgClUSEVsdNoI1zlk4FPSITxj1xP5zX4l4a5XWTcaq
m/e+WIhpqu0vTz/cCPkGpe0JZvrCzMiLwLsSXWtPG6Myzk0CAwEAAaNTMFEwHQYD
VR0OBBYEFH/+SxMr+7/RI7MarZB7THtqshtOMB8GA1UdIwQYMBaAFH/+SxMr+7/R
I7MarZB7THtqshtOMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEB
AHHA4VPuLvmuRlreCr7ljGxl0Xv9O3b1139KLEPGY0XHrOg2zKD1rFMaa2KTbDd5
HLYhIUGJhiAiH+uuXYE4wOuaeAIEAIZgM6JIoJfyjPkkMhZD7Va6iGoMymBr2d+y
U0/YX4PyQLqs/W6sEp3UC6Bt6niPqa9vAkKM89VZDjtmnwsNNOss7iU72e4+dCC9
dG2StKNND7/PVb5FxeEYgKnfUkOa/RieYcp4x38DjFFSjmgzZRcIfjWl3PchEc+F
YYRcB5kDMhq5gOe6JxMBc32u6ZXga1WvSxA8HSeknMqnx5pkFnbMykdfYl12trmz
uO0ZB1fn3tCTM9FF8dRAze4=
-----END CERTIFICATE-----`
}

const app = express();
app.disable('x-powered-by');
const server = http.createServer(app)
const httpsServer = https.createServer(sslOptions, app)

const PORT = parseInt(process.env.PORT ?? "3000");
if (!process.env.UUID) {
    console.error("请设置UUID");
    process.exit(-1);
}
const UUID = process.env.UUID;
const WSPATH = process.env.WSPATH ?? "";

const wssHttp = new ws.WebSocketServer({ server });
const wssHttps = new ws.WebSocketServer({ server: httpsServer });

app.get('/fetch', (req, res) => {
    const url = req.query.url;
    console.log(`url: ${url}`);
    if (!url) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }
    try {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (response) => {
            res.writeHead(response.statusCode, response.headers);
            response.pipe(res);
        }).on('error', (error) => {
            res.status(500).json({ error: 'Failed to fetch the URL', details: error.message });
        });
    } catch (error) {
        res.status(500).json({ error: 'Unexpected error', details: error.message });
    }
});

app.use('/*', function (req, res) {
    res.send({ result: 'OK', message: `Connections Alive: ${connecting}, Total Request: ${idHelper}`});
});

server.listen(PORT, (err, args) => {
    let address = JSON.stringify(PORT);
    console.log(`Server is running on port ${address}`);
    console.log(`websocket listening on ${address},uuid:${UUID},path:${WSPATH}`);
    utils.sendTelegramMessage(process.env.TTOKEN, `#${os.hostname()} 告警\nvless服务发生重启\naddress: ${address}`);
});
const SSL_PORT = 443;
httpsServer.listen(SSL_PORT, () => {
    let address = JSON.stringify(SSL_PORT);
    console.log(`Server is running on port ${address}`);
    console.log(`websocket listening on ${address},uuid:${UUID},path:${WSPATH}`);
    utils.sendTelegramMessage(process.env.TTOKEN, `#${os.hostname()} 告警\nvless服务发生重启\naddress: ${address}`);
});

//on, passenger会call两次
// wss.once("listening", () => {
//     let address = JSON.stringify(wss.address());
//     console.log(`listening on ${address},uuid:${UUID},path:${WSPATH}`);
//     utils.sendTelegramMessage(process.env.TTOKEN, `#Serv00-S15告警\nvless服务发生重启\naddress: ${address}`);
// });

setupWebSocketServer(wssHttp, "HTTP");
setupWebSocketServer(wssHttps, "HTTPS");
let connecting = 0;
let idHelper = 1;
const sessions = {};

// WebSocket 连接处理逻辑
function setupWebSocketServer(wss, protocol) {
    wss.on("connection", (socket) => {
        connecting++;
        socket.id = idHelper++;
        socket.pendings = [];
        socket.next = head.bind(null, socket);
        socket.setMaxListeners(100);
        // @ts-ignore
        // console.log("New connection from", socket.id, socket._socket.remoteAddress, socket._socket.remotePort)
        socket.on("message", (data, isBinary) => {
            socket.pendings.push(data);
            socket.next();
        });
        socket.on("error", () => {
            socket.close();
        });
        socket.once("close", () => {
            connecting--;
            // console.log("close", socket.id)
        });
        socket.once("close", () => {
            const prefix = socket.id.toString();
            for (const id in sessions) {
                let session = sessions[id];
                if (!id.startsWith(prefix)) {
                    continue;
                }
                delete sessions[id];
                session?.close?.();
            }
        });
        // 处理 WebSocket 0-RTT（零往返时间）的早期数据
        // 0-RTT 允许在完全建立连接之前发送数据，提高了效率
        const { earlyData, error } = (0, utils.base64ToBuffer)(socket.protocol);
        if (error) {
            // 如果解码早期数据时出错，将错误传递给控制器
            console.error(error);
        }
        else if (earlyData) {
            console.log(`处理早期数据(0RTT)Size: ${earlyData.byteLength}`);
            // 如果有早期数据，将其加入流的队列中
            socket.pendings.push(earlyData);
            socket.next();
        }
    });

    wss.on('error', (e) => {
        if (e.code == 'EADDRINUSE') {
            console.error(e);
            //Retry
            return;
        }
        // if (proxy.server.force) {
        //     return
        // }
    });
}



///仅在发送的时候才用到的buffer
const BUFFER_META_RESERVE = Buffer.allocUnsafe(64);
const BUFFER_LEN_RESERVE = Buffer.allocUnsafe(2);
const BUFFER_SUCCESS_RESP = Buffer.from([0, 0]);
function head(socket) {
    const buffer = fetch(socket, 24);
    if (buffer == null) {
        return;
    }
    let offset = 0;
    const version = buffer[offset++];
    const userid = (0, utils.stringify)(buffer.subarray(offset, offset += 16)); //1,17
    const optLength = buffer[offset++]; //17
    const optBuffer = buffer.subarray(offset, offset += optLength);
    const cmd = buffer[offset++]; //18+optLength
    //@ts-ignore
    let protocol = types.NameProtocols[cmd];
    if (protocol == null) {
        console.error("unsupported type:", cmd);
        socket.close();
        return;
    }
    if (!auth(socket, userid)) {
        //@ts-ignore
        const ip = socket._socket.remoteAddress;
        //@ts-ignore
        const port = socket._socket.remotePort;
        console.error("auth failed type:", cmd, ip, port);
        socket.close();
        return;
    }
    if (protocol == "mux") { //mux
        const head = buffer.subarray(offset);
        socket.pendings.push(head);
        socket.next = mux.bind(null, socket);
        socket.send(BUFFER_SUCCESS_RESP);
        mux(socket);
        return;
    }
    //@ts-ignore
    const dest = {
        protocol,
        port: buffer.readUint16BE(offset),
    };
    offset += 2;
    offset = (0, utils.readAddress)(buffer, dest, offset);
    if (!dest.host || dest.host.length == 0 || !dest.port) {
        console.error("invalid  addressType:", dest.host, dest.port);
        socket.close();
        return;
    }
    socket.removeAllListeners("message");
    socket.send(BUFFER_SUCCESS_RESP);
    const head = buffer.subarray(offset);
    switch (dest.protocol) {
        case "tcp": //tcp
            tcp(socket, dest, head);
            break;
        case "udp": //udp
            udp(socket, dest, head);
            break;
        default: //unknown
            console.error("unsupported dest.protocol type", cmd);
            socket.close();
            break;
    }
}
/**
 * 如果数量足够，就取出全部
 * 否则，返回空
 * @param socket
 * @param at_least 要满足的最小数量
 * @returns
 */
function fetch(socket, at_least) {
    let total = 0;
    for (let one of socket.pendings) {
        total += one.length;
    }
    if (total < at_least) {
        return;
    }
    if (socket.pendings.length == 1) {
        return socket.pendings.pop();
    }
    const buffer = Buffer.allocUnsafe(total);
    let offset = 0;
    while (socket.pendings.length > 0) {
        const one = socket.pendings.shift();
        offset += one.copy(buffer, offset, one.length);
    }
    return buffer;
}
function auth(_, uuid) {
    return uuid === UUID;
}
function tcp(socket, dest, head) {
    // console.log("connect to tcp", dest.host, dest.port)
    const next = (0, net.createConnection)({ host: dest.host, port: dest.port }, () => {
        console.log("tcp connected", socket.id, dest.host, dest.port);
    });
    next.setKeepAlive(true);
    next.setNoDelay(true);
    next.setTimeout(3000);
    const clientStream = (0, ws.createWebSocketStream)(socket, {
        allowHalfOpen: false, //可读端end的时候，调用可写端.end()了
        autoDestroy: true,
        emitClose: true,
        objectMode: false,
        writableObjectMode: false
    });
    if (head.length > 0) {
        // console.log("send head", socket.id, dest.host, dest.port)
        // console.log(head.toString("utf8"))
        clientStream.unshift(head);
    }
    clientStream.pipe(next).pipe(clientStream);
    next.on("error", (error) => {
        console.error(socket.id, dest.host, dest.port, error);
        next.destroySoon();
    });
    const destroy = () => {
        if (socket.readyState === ws.WebSocket.OPEN) {
            socket.close();
        }
        if (!next.destroyed) {
            next.destroy();
        }
    };
    (0, stream.finished)(next, destroy);
    (0, stream.finished)(clientStream, destroy);
}
function udp(socket, dest, head) {
    const waiting = { pendings: [] };
    if (head.length > 0) {
        waiting.pendings.push(head);
    }
    let connected = false;
    const target = (0, dgram.createSocket)("udp4");
    function flushTarget() {
        const buffer = fetch(waiting, 3);
        if (buffer == null) {
            return;
        }
        const length = buffer.readUint16BE(0);
        if (2 + length > buffer.length) {
            waiting.pendings.push(buffer);
            return;
        }
        const end = 2 + length;
        target.send(buffer.subarray(2, end), dest.port, dest.host);
        if (end < buffer.length) {
            waiting.pendings.push(buffer.subarray(end));
            flushTarget();
        }
    }
    target.connect(dest.port, dest.host, () => {
        connected = true;
        console.log("udp connected", dest.host, dest.port);
        flushTarget();
    });
    target.on("message", (data) => {
        //由于长度限制，这里要考虑分页
        let offset = 0;
        const lenBuffer = BUFFER_LEN_RESERVE;
        //这里有问题，udp数据就应该完整弄过去的，但是uint16的长度有上限
        while (offset < data.length) {
            const len = Math.min(data.length - offset, 65535);
            lenBuffer.writeUint16BE(len);
            socket.send(lenBuffer);
            socket.send(data.subarray(offset, offset += len));
        }
    });
    target.on("error", () => {
        target.close();
    });
    target.once("close", () => {
        connected = false;
        if (socket.readyState === ws.WebSocket.OPEN) {
            socket.close();
        }
    });
    socket.on("message", (data) => {
        waiting.pendings.push(data);
        if (connected) {
            flushTarget();
        }
    });
    socket.on("error", () => {
        socket.close();
    });
    socket.once("close", () => {
        target.close();
    });
}
function mux(socket) {
    const buffer = fetch(socket, 2 + 2 + 1 + 1);
    if (buffer == null) {
        return;
    }
    let offset = 0;
    const metaLength = buffer.readUInt16BE(offset);
    offset += 2;
    if (metaLength < 4) {
        socket.close();
        return;
    }
    if (offset + metaLength > buffer.length) { //没有收全
        socket.pendings.push(buffer);
        return;
    }
    const meta = buffer.subarray(offset, offset += metaLength);
    const hasExtra = meta[3] == 1;
    //额外数据开始的偏移
    const extra_length = hasExtra ? buffer.readUInt16BE(offset) : 0;
    offset += hasExtra ? 2 : 0;
    if (hasExtra && offset + extra_length > buffer.length) { //没有收全
        socket.pendings.push(buffer);
        return;
    }
    const extra = hasExtra ? buffer.subarray(offset, offset += extra_length) : undefined;
    const left = offset < buffer.length ? buffer.subarray(offset) : undefined;
    muxDispatch(socket, meta, extra);
    if (left && left.length > 0) {
        // console.log("😈 recv mux left > 0", socket.id, type)
        socket.pendings.push(left);
        mux(socket);
    }
}
function muxDispatch(socket, meta, extra) {
    const uid = meta.readUInt16BE();
    const cmd = meta[2];
    if (cmd === 1) { //创建
        muxNew(socket, uid, meta, extra);
        return;
    }
    const id = `${socket.id}/${uid}`;
    const session = sessions[id];
    if (!session) {
        sendClientEnd(socket, meta);
        return;
    }
    switch (cmd) {
        case 2:
            muxKeep(socket, session, meta, extra);
            break;
        case 3:
            muxEnd(socket, session, meta, extra);
            break;
        case 4:
            muxKeepAlive(socket, session, meta, extra);
            break;
        default:
            socket.close();
            break;
    }
}
function muxNew(socket, uid, meta, extra) {
    const dest = (0, utils.readMetaAddress)(meta);
    const id = `${socket.id}/${uid}`;
    if (!dest.host || dest.port === 0) {
        sendClientEnd(socket, meta);
        console.error("invalid mux new addressType:", dest.protocol, id, dest.host, dest.port);
        return;
    }
    console.log("😈 mux new", dest.protocol, id, dest.host, dest.port);
    //@ts-ignore
    const session = sessions[id] = {
        id,
        uid,
        dest
    };
    switch (dest.protocol) {
        case "tcp":
            muxNewTcp(socket, session, meta);
            break;
        case "udp":
            muxNewUdp(socket, session, meta);
            break;
        default:
            socket.close();
            return;
    }
    if (extra && extra.length > 0) {
        muxKeep(socket, session, meta, extra);
    }
}
function muxNewTcp(socket, session, meta) {
    const target = (0, net.createConnection)({ host: session.dest.host, port: session.dest.port }, () => {
        console.log("mux tcp connected", session.id, session.dest.host, session.dest.port);
    });
    target.setKeepAlive(true);
    target.setNoDelay(true);
    target.setTimeout(3000);
    target.on("data", (buffer) => {
        // console.log("-----------recv-----------")
        // console.log(buffer.toString("utf8"))
        sendClientTcpKeep(socket, meta, buffer);
    });
    target.on("end", () => {
        target.destroy();
    });
    target.on("error", () => {
        target.destroy();
    });
    target.once("close", () => {
        const deleted = delete sessions[session.id];
        if (deleted) {
            sendClientEnd(socket, meta);
        }
    });
    session.send = (data) => {
        if (target.writable) {
            target.write(data);
        }
    };
    session.close = () => {
        if (target.writable) {
            target.destroySoon();
        }
    };
}
function muxNewUdp(socket, session, meta) {
    let alreadyClose = false;
    let last = Date.now();
    const target = (0, dgram.createSocket)("udp4");
    target.bind();
    target.on("message", (data, rinfo) => {
        last = Date.now();
        // console.log("send client mux keep udp", session.id, rinfo.address, rinfo.port)
        sendClientUdpKeep(socket, meta, rinfo, data);
    });
    target.on("error", () => {
        target.close();
    });
    const timer = setInterval(() => {
        if (Date.now() - last < 30000) {
            return;
        }
        if (!alreadyClose) {
            target.close();
        }
    }, 10000);
    target.once("close", () => {
        alreadyClose = true;
        clearInterval(timer);
        const deleted = delete sessions[session.id];
        if (deleted) {
            sendClientEnd(socket, meta);
        }
    });
    session.send = (msg, port, host) => {
        last = Date.now();
        //@ts-ignore
        target.send(msg, port, host);
    };
    session.close = () => {
        if (!alreadyClose) {
            target.close();
        }
    };
}
function muxKeep(socket, session, meta, extra) {
    if (!extra || extra.length == 0) {
        return;
    }
    if (session.dest.protocol === "tcp") {
        session.send(extra);
        return;
    }
    const dest = session.dest;
    session.send(extra, dest.port, dest.host);
}
function muxEnd(socket, session, meta, extra) {
    delete sessions[session.id];
    console.log("mux end", session.dest.protocol, session.id, session.dest.host, session.dest.port);
    if (extra) {
        session.send(extra);
    }
    session.close();
}
function muxKeepAlive(socket, session, meta, extra) {
    /**
     * 保持连接 (KeepAlive)
        2 字节	1 字节	1 字节
        ID	0x04	选项 Opt
        在保持连接时:
 
        若 Opt(D) 开启，则这一帧所带的数据必须被丢弃。
        ID 可为随机值。
        #应用
     */
    const id = `${socket.id}/${meta.readUInt16BE()}`;
    console.log("mux keepAlive", id);
}
function sendClientTcpKeep(socket, originMeta, extra) {
    if (socket.readyState !== ws.WebSocket.OPEN) {
        return;
    }
    const meta = originMeta.subarray(0, 4);
    //[0][1] = id
    meta[2] = 2; //cmd
    meta[3] = 1; //hasExtra 
    if (extra.length < 65535) {
        sendClientMuxData(socket, meta, extra);
        return;
    }
    //由于长度限制，这里要考虑分页
    let offset = 0;
    while (offset < extra.length) {
        const len = Math.min(extra.length - offset, 65535);
        sendClientMuxData(socket, meta, extra.subarray(offset, offset += len));
    }
}
function sendClientUdpKeep(socket, originMeta, rinfo, extra) {
    if (socket.readyState !== ws.WebSocket.OPEN) {
        return;
    }
    const preparedMeta = BUFFER_META_RESERVE;
    //id
    preparedMeta[0] = originMeta[0];
    preparedMeta[1] = originMeta[1];
    preparedMeta[2] = 2; //cmd
    preparedMeta[3] = 1; //hasExtra 
    // const dest: Dest = {
    //     port: rinfo.port,
    //     host: rinfo.address,
    //     protocol: "udp",
    //     //@ts-ignore
    //     family: rinfo.family.toLowerCase(),
    // }
    // const metaLength = writeMetaAddress(preparedMeta, dest, 4)
    const metaLength = 4;
    const meta = preparedMeta.subarray(0, metaLength);
    if (extra.length < 65535) {
        sendClientMuxData(socket, meta, extra);
        return;
    }
    //由于长度限制，这里要考虑分页
    let offset = 0;
    while (offset < extra.length) {
        const len = Math.min(extra.length - offset, 65535);
        sendClientMuxData(socket, meta, extra.subarray(offset, offset += len));
    }
}
function sendClientMuxData(socket, meta, data) {
    //meta.length(2) + meta(meta.length) + data.length(2) + data(data.length)
    const lenBuffer = BUFFER_LEN_RESERVE;
    lenBuffer.writeUint16BE(meta.length);
    socket.send(lenBuffer);
    socket.send(meta);
    lenBuffer.writeUint16BE(data.length);
    socket.send(lenBuffer);
    socket.send(data);
}
function sendClientEnd(socket, originMeta) {
    if (socket.readyState !== ws.WebSocket.OPEN) {
        return;
    }
    // console.log("😢 send mux end", id)
    const meta = originMeta.subarray(0, 4);
    meta[2] = 3; //type
    meta[3] = 0; //has_opt
    const lenBuffer = BUFFER_LEN_RESERVE;
    lenBuffer.writeUint16BE(meta.length);
    socket.send(lenBuffer);
    socket.send(meta);
}
//# sourceMappingURL=index.js.map
