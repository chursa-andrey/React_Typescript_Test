import React, { useState, useEffect } from 'react'
import { ModalItem } from '../ModalItem/ModalItem'
import { Storage, ItemTypes, StringItemTypes } from '../../../CalendarHelper'
import { css } from '@emotion/react'

const ulCss = css`
  margin: 10px 0 0;
  padding-left: 19px;
  list-style: none; 
  counter-reset: li;
`

type DnDListProps = {
    items: ItemTypes[],
    type: StringItemTypes,
    editItem: (item: ItemTypes, type: string, index: number) => void,
    handleSortItems: (sortItems: ItemTypes[]) => void
}

export function DnDList(
    {
        items,
        type,
        editItem,
        handleSortItems
    }: DnDListProps): JSX.Element {

    const [currentItems, setCurrentItems] = useState<ItemTypes[]>([])
    const [sort, setSort] = useState<number>(0)
    let currentItem: ItemTypes

    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, item: ItemTypes): void => {
        currentItem = item
    }

    const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
        e.preventDefault()
    }

    const handleDrag = (e: React.DragEvent<HTMLLIElement>, item: ItemTypes): void => {
        e.preventDefault()

        const sortItems = currentItems;
        currentItems.map((val, index) => {
            if(item.getItem() === val.getItem()){
                sortItems[index] = currentItem
            }

            if(currentItem.getItem() === val.getItem()){
                sortItems[index] = item
            }
        })

        setCurrentItems(sortItems)
        handleSortItems(sortItems)
        setSort(sort + 1)
    }

    useEffect(() => {
        setCurrentItems(items)
    })

    return (
        <>
            {currentItems.length ? (
                <ul css={ulCss}>
                    {(
                        currentItems.map((val, index) => (
                            <ModalItem
                                key={'key_' + Date.now() + '_' + index}
                                item={val}
                                type={type}
                                index={index}
                                editItem={editItem}
                                handleDragStart={handleDragStart}
                                handleDragOver={handleDragOver}
                                handleDrag={handleDrag}
                            />
                        ))
                    )}
                </ul>
            ) : (
                <></>
            )}
        </>
    )
}
