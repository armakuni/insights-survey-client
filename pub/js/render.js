export { html, render, useState, useRef, useEffect } from "https://unpkg.com/htm/preact/standalone.module.js";
export function fakeId() {

    return `${Date.now()}_${Math.random().toString().slice(2)}`;

}
