
export enum DefaultValues {
    LABEL_STORAGE_NAME = 'labelList',
    COLOR = '#333333',
    DATE_FORMAT = 'd MMMM yyyy',
    HOLIDAYS_API_URL = 'https://date.nager.at/api/v3/PublicHolidays/2023/UA'
}

export enum UsedItemTypes {
    TASK = 'Task',
    LABEL = 'Lable',
    ALL = 'All'
}

export type StringItemTypes = 'Task' | 'Lable' | 'All'
export type ItemTypes = Task | Label
export type ItemList = {
    [item: string]: ItemTypes[]
}

export abstract class AbstractItem {
    getColor(): string{
        return DefaultValues.COLOR
    }

    abstract getItem(): string
}

export class Task extends AbstractItem {
    private _task: string;
    private _labelIndexes: number[];
    constructor(task: string, labelIndexes: number[] = []) {
        super()
        this._task = task;
        this._labelIndexes = labelIndexes;
    }

    public setTask(theTask: string): this {
        this._task = theTask;
        return this;
    }

    public setLabelsIndexes(theLabelIndexes: number[]): this {
        this._labelIndexes = theLabelIndexes;
        return this;
    }

    public addLabelIndex(theLabelIndex: number): this {
        this._labelIndexes.push(theLabelIndex)
        return this;
    }

    public getTask(): string {
        return this._task;
    }

    public getItem(): string {
        return this.getTask()
    }

    public getLabelIndexes(): number[] {
        return this._labelIndexes;
    }
}

export class Label extends AbstractItem{
    private _label: string
    private _color: string
    constructor(label: string, color: string) {
        super()
        this._label = label
        this._color = color
    }

    public setLabel(theLabel: string): this {
        this._label = theLabel
        return this
    }

    public setColor(theColor: string): this {
        this._color = theColor
        return this
    }

    public getLabel(): string {
        return this._label
    }

    public getItem(): string {
        return this.getLabel()
    }

    public getColor(): string {
        return this._color
    }
}

export class Storage {
    private _items: ItemList = {}
    public addItem(item: ItemTypes, storageName: string ): this {
        if(this._items[storageName]?.length){
            this._items[storageName].push(item)
        }else{
            this._items[storageName] = []
            this._items[storageName].push(item)
        }

        return this
    }

    public setItems(items: ItemTypes[], storageName: string): this {
        this._items[storageName] = items
        return this
    }

    public changeItem(newItem: ItemTypes, storageName: string, index: number): this {
        this._items[storageName][index] = newItem
        return this
    }

    public getItemsByStorageName(storageName: string): ItemTypes[] {
        if(this._items[storageName]?.length)
            return this._items[storageName]
        else
            return []
    }

    public getAllItems(): ItemList {
        return this._items
    }

    public getOnlyTasks(): ItemList {
        const allItems = {...this.getAllItems()}
        delete allItems[DefaultValues.LABEL_STORAGE_NAME]
        return allItems
    }

    public deleteByStorageName(storageName: string): this {
        const items = this.getAllItems()
        delete items[storageName]
        this._items = items

        return this
    }
}
