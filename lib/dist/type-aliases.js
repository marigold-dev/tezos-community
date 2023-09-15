import { assertMichelsonInstruction, } from "@taquito/michel-codec";
import { MichelsonMap } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
const createStringTypeTas = () => {
    return (value) => value;
};
const createBigNumberTypeTas = () => {
    return (value) => new BigNumber(value);
};
export function asMap(value) {
    const m = new MichelsonMap();
    if (Array.isArray(value)) {
        const vArray = value;
        vArray.forEach((x) => m.set(x.key, x.value));
    }
    else {
        const vObject = value;
        Object.keys(vObject).forEach((key) => m.set(key, vObject[key]));
    }
    return m;
}
const asBigMap = (value) => asMap(value);
function add(a, b) {
    return a.plus(b);
}
function subtract(a, b) {
    return a.minus(b);
}
function createLambdaTypeTas(expr) {
    assertMichelsonInstruction(expr);
    return expr;
}
/** tas: Tezos 'as' casting for strict types */
export const tas = {
    address: createStringTypeTas(),
    bytes: createStringTypeTas(),
    contract: createStringTypeTas(),
    chest: createStringTypeTas(),
    chest_key: createStringTypeTas(),
    timestamp: (value) => new Date(value).toISOString(),
    int: createBigNumberTypeTas(),
    nat: createBigNumberTypeTas(),
    mutez: createBigNumberTypeTas(),
    tez: createBigNumberTypeTas(),
    map: asMap,
    bigMap: asBigMap,
    // Operations
    add,
    subtract,
    lambda: createLambdaTypeTas,
    // To number
    number: (value) => Number(value + ""),
    unit: () => true,
};
