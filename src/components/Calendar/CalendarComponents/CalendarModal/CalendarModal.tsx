import React, {MouseEvent, useContext, useRef} from 'react'

import stiled from '@emotion/styled'
import {css} from '@emotion/react'
import {AppContext, Types} from '../../AppStore'
import {DnDList} from './DnDList/DnDList'
import {InputText} from './InputText/InputText'
import {InputColor} from './InputColor/InputColor'
import {SelectLabels} from './SelectLabels/SelectLabels'
import {DefaultValues, ItemTypes, Label, StringItemTypes, Task, UsedItemTypes} from '../../CalendarHelper'

type ModalProps = {
    type: StringItemTypes
}

const Modal = stiled('div')<ModalProps>(
    {
        position: 'absolute',
        zIndex: 100,
        width: '350px',
        padding: '10px 20px 20px',
        borderRadius: '7px',
        backgroundColor: 'rgba(230, 230, 245, 0.95)',
        textAlign: 'left'
    },
    props => (props.type === UsedItemTypes.TASK ? {
        top: '80px',
        left: 'calc(50% - 195px)'
    } : {
        top: '45px',
        right: '1px'
    })
)

const closeButtonCss = css`
  position: absolute;
  top: 5px;
  right: 7px;
  padding: 0 2px;
  font-size: 0.6em;
  text-decoration: none;
  color: #282c34;
`

const formCss = css`
  padding-top: 0;
`

const submitCss = css`
  margin-top: 5px;
  text-align: right;
  button {
    padding: 7px 10px 6px;
    font-size: 0.5em;
    cursor: pointer;
  }
`

const dateTitleCss = css`
  font-size: 0.8em;
  color: black;
  text-align: center;
`

type CalendarModalProps = {
    type: StringItemTypes,
    storageName: string
}

export function CalendarModal(
    {
        type,
        storageName
    }: CalendarModalProps): JSX.Element {
    const {state, dispatch} = useContext(AppContext)
    const inputTextRef = useRef<HTMLInputElement>(null)
    const inputColorRef = useRef<HTMLInputElement>(null)
    const inputEditIndexRef = useRef<HTMLInputElement>(null)
    const selectRef = useRef<HTMLSelectElement>(null)

    const items = state.mainStore.getItemsByStorageName(storageName)

    const getTitle = (): string => {
        return (type === UsedItemTypes.TASK)
            ? storageName.replaceAll('_', ' ')
            : 'Label list'
    }

    const closeModal = (e: MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault()
        dispatch({type: Types.TASK_MODAL, payload: false})
        dispatch({type: Types.LABEL_MODAL, payload: false})
    }

    const updateStorage = (item: ItemTypes): void => {
        let updatedStorage
        const index = (inputEditIndexRef?.current?.value)
            ? inputEditIndexRef.current.value
            : undefined

        if(index){
            updatedStorage = state.mainStore.changeItem(item, storageName, Number(index))
        }else{
            updatedStorage = state.mainStore.addItem(item, storageName)
        }

        dispatch({type: Types.MAIN_STORE, payload: updatedStorage})

        if(inputTextRef?.current?.value)
            inputTextRef.current.value = ''
    }

    const addToStorage = (): void => {
        switch (type){
            case (UsedItemTypes.TASK):
                if(inputTextRef?.current?.value.trim() && selectRef?.current){
                    const itemName = inputTextRef.current.value
                    const labalIndexes = Array.from(selectRef.current.options)
                        .filter(option => option.selected)
                        .map(option => option.value);

                    if(labalIndexes.length){
                        const labelIndexes = getLabelIndexes(labalIndexes)
                        updateStorage(new Task(itemName, labelIndexes))
                    }
                }
                break;
            case (UsedItemTypes.LABEL):
                if(inputTextRef?.current?.value.trim() && inputColorRef?.current?.value){
                    const itemName = inputTextRef.current.value
                    const color = inputColorRef.current.value

                    updateStorage(new Label(itemName, color))
                }
                break;
            default:
                throw new Error(`Error: unknown item type.`);
        }
    }

    const getLabelIndexes = (labelIndexes: string[]): number[] => {
        const labelArray = state.mainStore.getItemsByStorageName(DefaultValues.LABEL_STORAGE_NAME)
        const selectedLabelIndexes: number[] = []

        if(labelArray.length){
            labelArray.forEach((value, index) => {
                if(labelIndexes.includes(index.toString())){
                    selectedLabelIndexes.push(index)
                }
            })
        }

        return selectedLabelIndexes
    }

    const handleSortItems = (sortItems: ItemTypes[]): void => {
        const updatedStorage = state.mainStore.setItems(sortItems, storageName)
        dispatch({type: Types.MAIN_STORE, payload: updatedStorage})

        const allLabels = state.mainStore.getItemsByStorageName(DefaultValues.LABEL_STORAGE_NAME)
        if(inputTextRef?.current && inputEditIndexRef.current && selectRef?.current){
            inputTextRef.current.value = ''
            inputEditIndexRef.current.value = ''
            for(let i = 0; i < allLabels.length; i++){
                selectRef.current.options[i].selected = false
            }
        }
    }

    const getSelectedLabels = (labelIndexes: number[]): {indexes: number[], allLabelsLength: number} => {
        const indexes: number[] = []
        const allLabels = state.mainStore.getItemsByStorageName(DefaultValues.LABEL_STORAGE_NAME)
        allLabels.forEach((lable, index) => {
            labelIndexes.forEach((lableIndex) => {
                if(lableIndex === index){
                    indexes.push(index)
                }
            })
        })

        return {indexes: indexes, allLabelsLength: allLabels.length}
    }

    const editItem = (item: ItemTypes, type: string, index: number): void => {
        switch (type){
            case (UsedItemTypes.TASK):
                if(inputTextRef?.current && inputEditIndexRef.current && selectRef?.current){
                    inputTextRef.current.value = item.getItem()
                    if('getLabelIndexes' in item){
                        const data = getSelectedLabels(item.getLabelIndexes())
                        for(let i = 0; i < data.allLabelsLength; i++){
                            if(data.indexes.includes(i)){
                                selectRef.current.options[i].selected = true
                            }else{
                                selectRef.current.options[i].selected = false
                            }
                        }
                    }
                    inputEditIndexRef.current.value = index.toString()
                }
                break;
            case (UsedItemTypes.LABEL):
                if(inputTextRef?.current && inputColorRef?.current && inputEditIndexRef?.current){
                    inputTextRef.current.value = item.getItem()
                    inputColorRef.current.value = item.getColor()
                    inputEditIndexRef.current.value = index.toString()
                }
                break;
            default:
                throw new Error(`Error: unknown item type.`);
        }
    }

    return (
        <Modal type={type}>
            <a href="#" css={closeButtonCss} onClick={closeModal}>&#10006;</a>
            <div css={formCss}>
                <div css={dateTitleCss}>{ getTitle() }</div>
                <DnDList
                    items={items}
                    type={type}
                    editItem={editItem}
                    handleSortItems={handleSortItems}
                />
                <InputText type={type} inputTextRef={inputTextRef} />
                {type === UsedItemTypes.LABEL && (
                    <InputColor inputColorRef={inputColorRef} />
                )}
                {type === UsedItemTypes.TASK && (
                    <SelectLabels selectRef={selectRef} />
                )}
                <input
                    type="hidden"
                    ref={inputEditIndexRef}
                    id="editIndex"
                    name="editIndex"
                    value=""
                />
                <div css={submitCss}>
                    <button onClick={addToStorage}>Save {type}</button>
                </div>
            </div>
        </Modal>
    )
}
