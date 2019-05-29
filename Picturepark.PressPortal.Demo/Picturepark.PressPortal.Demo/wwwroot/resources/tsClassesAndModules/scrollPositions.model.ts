export class ScrollPosition {
    element: HTMLElement;
    posY: number;
    posX: number;

    constructor(data?: any) {
        this.element = document.getElementsByClassName("header-top-row")[0] as HTMLElement,
            this.posY = window.scrollY,
            this.posX = data.posX;
    }
}