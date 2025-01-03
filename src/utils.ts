import { Dest, Protocols, NameProtocols } from "./types"

export const isIPv4 = (address: string) => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(address)
export const isIPv6 = (address: string) => /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(address)
export const isDomain = (address: string) => /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9])*$/.test(address)

export function readMetaAddress(meta: Buffer, offset: number = 4) {

    //@ts-ignore
    const dest: Dest = {}

    dest.protocol = NameProtocols[meta.readUint8(offset++)]
    dest.port = meta.readUInt16BE(offset)

    offset += 2

    readAddress(meta, dest, offset)

    return dest
}

export function readAddress(meta: Buffer, dest: Dest, offset: number) {

    const addressType = meta.readUint8(offset++)

    switch (addressType) {
        case 0x01:      //ipv4
            dest.family = "ipv4"
            dest.host = `${meta[offset++]}.${meta[offset++]}.${meta[offset++]}.${meta[offset++]}`
            break
        case 0x02:      //domain
            {
                const size = meta[offset++]
                dest.family = "domain"
                dest.host = meta.subarray(offset, offset += size!).toString()
            }
            break
        case 0x03:      //ipv6
            {
                const array = []

                for (let i = 0; i < 8; i++, offset += 2) {
                    array.push(meta.readUint16BE(offset).toString(16));
                }
                dest.family = "ipv6"
                dest.host = array.join(":")
            }
            break
    }

    return offset
}

export function writeMetaAddress(meta: Buffer, dest: Dest, offset: number) {

    offset = meta.writeUint8(Protocols[dest.protocol!], offset)
    offset = meta.writeUInt16BE(dest.port, offset)

    return writeAddress(meta, dest, offset)
}

export function writeAddress(meta: Buffer, dest: Dest, offset: number) {

    switch (dest.family) {
        case "ipv4":
            offset = meta.writeUInt8(0x01, offset)
            dest.host.split(".").forEach(e => offset = meta.writeUInt8(parseInt(e), offset))
            break
        case "domain":
            {
                const sub = Buffer.from(dest.host)

                offset = meta.writeUInt8(0x02, offset)
                offset = meta.writeUInt8(sub.byteLength, offset)

                offset += sub.copy(meta, offset)
            }
            break
        case "ipv6":
            {
                const array = dest.host.split(":")

                offset = meta.writeUInt8(0x03, offset)

                for (let i = 0; i < array.length; i++) {
                    offset = meta.writeUInt16BE(parseInt(array[i]!, 16), offset)
                }
            }
            break
    }

    return offset
}

const byteToHex: string[] = [];

for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).slice(1));
}

export function stringify(arr: Buffer, offset = 0) {
    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
    // @ts-ignore
    return byteToHex[arr[offset]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}


/**
 * 将 Base64 编码的字符串转换为 ArrayBuffer
 *
 * @param {string} base64Str Base64 编码的输入字符串
 * @returns {{ earlyData: Buffer | undefined, error: Error | null }} 返回解码后的 ArrayBuffer 或错误
 */
export function base64ToBuffer(base64Str: any) {
    // 如果输入为空，直接返回空结果
    if (!base64Str) {
        return { error: null };
    }
    try {
        // Go 语言使用了 URL 安全的 Base64 变体（RFC 4648）
        // 这种变体使用 '-' 和 '_' 来代替标准 Base64 中的 '+' 和 '/'
        // JavaScript 的 atob 函数不直接支持这种变体，所以我们需要先转换
        base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');

        // 使用 atob 函数解码 Base64 字符串
        // atob 将 Base64 编码的 ASCII 字符串转换为原始的二进制字符串
        const decode = atob(base64Str);

        // 将二进制字符串转换为 Uint8Array
        // 这是通过遍历字符串中的每个字符并获取其 Unicode 编码值（0-255）来完成的
        const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
        const buffer = Buffer.from(arryBuffer);

        // 返回 Uint8Array 的底层 ArrayBuffer
        // 这是实际的二进制数据，可以用于网络传输或其他二进制操作
        return { earlyData: buffer, error: null };
    } catch (error) {
        // 如果在任何步骤中出现错误（如非法 Base64 字符），则返回错误
        return { error };
    }
}