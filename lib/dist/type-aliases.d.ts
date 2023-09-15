import { Expr, MichelsonCode } from "@taquito/michel-codec";
import { MichelsonMap } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
export type Instruction = MichelsonCode;
export type unit = (true | undefined) & {
    __type: "unit";
};
export type address = string & {
    __type: "address";
};
export type bytes = string & {
    __type: "bytes";
};
export type contract = string & {
    __type: "contract";
};
export type operation = string & {
    __type: "operation";
};
export type key = string & {
    __type: "key";
};
export type key_hash = string & {
    __type: "key_hash";
};
export type signature = string & {
    __type: "signature";
};
export type ticket = string & {
    __type: "ticket";
};
export type timestamp = string & {
    __type: "timestamp";
};
export type int = BigNumber & {
    __type: "int";
};
export type nat = BigNumber & {
    __type: "nat";
};
export type mutez = BigNumber & {
    __type: "mutez";
};
export type tez = BigNumber & {
    __type: "tez";
};
type MapKey = Array<any> | object | string | boolean | number;
export type MMap<K extends MapKey, V> = Omit<MichelsonMap<K, V>, "get"> & {
    get: (key: K) => V;
};
export type BigMap<K extends MapKey, V> = Omit<MichelsonMap<K, V>, "get"> & {
    get: (key: K) => Promise<V>;
};
export type chest = string & {
    __type: "chest";
};
export type chest_key = string & {
    __type: "chest_key";
};
type asMapParamOf<K, V> = K extends string ? {
    [key: string]: V;
} | Array<{
    key: K;
    value: V;
}> : K extends number ? {
    [key: number]: V;
} | Array<{
    key: K;
    value: V;
}> : Array<{
    key: K;
    value: V;
}>;
export declare function asMap<K extends MapKey, V>(value: asMapParamOf<K, V>): MMap<K, V>;
declare function add<T extends BigNumber>(a: T, b: T): T;
declare function subtract<T extends BigNumber>(a: T, b: T): T;
declare function createLambdaTypeTas(expr: Expr): MichelsonCode;
/** tas: Tezos 'as' casting for strict types */
export declare const tas: {
    address: (value: string) => address;
    bytes: (value: string) => bytes;
    contract: (value: string) => contract;
    chest: (value: string) => chest;
    chest_key: (value: string) => chest_key;
    timestamp: (value: string | Date) => timestamp;
    int: (value: number | BigNumber | string) => int;
    nat: (value: number | BigNumber | string) => nat;
    mutez: (value: number | BigNumber | string) => mutez;
    tez: (value: number | BigNumber | string) => tez;
    map: typeof asMap;
    bigMap: <K extends MapKey, V>(value: asMapParamOf<K, V>) => BigMap<K, V>;
    add: typeof add;
    subtract: typeof subtract;
    lambda: typeof createLambdaTypeTas;
    number: (value: string | BigNumber) => number;
    unit: () => unit;
};
export {};
