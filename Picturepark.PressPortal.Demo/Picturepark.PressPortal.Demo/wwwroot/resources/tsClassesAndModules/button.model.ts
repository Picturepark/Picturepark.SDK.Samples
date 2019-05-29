export class Button {
    id: HTMLElement;
    content: HTMLElement;

    constructor(data?: any) {
        this.id = data.id;
        this.content = data.content;
    }
}