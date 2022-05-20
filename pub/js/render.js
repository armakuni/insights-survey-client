// debug (+devtools):
import "https://esm.sh/preact@10.7.2/debug";
// htm & preact core:
export { html, render } from "https://esm.sh/htm@3.1.1/preact";
// createContext
export { createContext } from "https://esm.sh/preact@10.7.2";
// hooks:
export { useState, useRef, useEffect, useContext } from "https://esm.sh/preact@10.7.2/hooks";

export function fakeId() {

    return `${Date.now()}_${Math.random().toString().slice(2)}`;

}
