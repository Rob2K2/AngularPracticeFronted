export class AddItemsAction {
    static readonly type = '[ITEMS] Add'

    constructor(public items: string[]) {}
}