import "https://cdn.esm.sh/preact/devtools";
export { html, render, useState, useRef, useEffect, useContext, createContext } from "https://cdn.esm.sh/v78/htm@3.1.1/es2022/preact/standalone.module.js";

export function fakeId() {

    return `${Date.now()}_${Math.random().toString().slice(2)}`;

}
