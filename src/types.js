"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameProtocols = exports.Protocols = void 0;
// export type VlessProtocol = "tcp" | "udp" | "mux" | "unknown"
exports.Protocols = {
    tcp: 1,
    udp: 2,
    mux: 3,
};
exports.NameProtocols = Object.entries(exports.Protocols).reduce((acc, [key, value]) => {
    //@ts-ignore
    acc[value] = key;
    return acc;
}, {});
//# sourceMappingURL=types.js.map