import {v4} from "uuid";

export class Box<T> {
    id: string
    item: T

    constructor(item: T) {
        this.item = item
        this.id = v4()
    }
}
