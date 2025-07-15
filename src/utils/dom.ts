// src/utils/dom.ts

export function createElement(tag: string, attributes: Record<string, string> = {}, children: (HTMLElement | string)[] = []): HTMLElement {
    const element = document.createElement(tag);
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    return element;
}

export function render(containerId: string, element: HTMLElement) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = ''; // Clear existing content
        container.appendChild(element);
    } else {
        console.error(`Container with ID "${containerId}" not found.`);
    }
}