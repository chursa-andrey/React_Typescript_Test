import React from 'react'

import { css } from '@emotion/react'
import { CalendarItem } from '../../CalendarItem/CalendarItem'
import { ItemTypes, StringItemTypes, UsedItemTypes } from '../../../CalendarHelper'

const liCss = css`
  width: 100%;
  padding: 12px 0;
  border-bottom: 1px solid #888;
  font-size: 0.7em;
  &:last-child{
    border: none;
  }
  counter-increment: li;
  &::before {
    content: counter(li)".";
    color: black;
    display: inline-block;
    width: 1em;
    margin-top: -3em; 
    margin-left: -1em
  }
`

const itemSectionCss = css`
  display: inline-flex;
  align-items: center;
  width: 100%;
  font-size: 1em;
  color: #333;
`

const buttonCss = css`
  width: 20%;
  padding: 8px 10px 7px;
  margin-left: 15px;
`

type ModalItemProps = {
    item: ItemTypes,
    type: StringItemTypes,
    index: number,
    editItem: (item: ItemTypes, type: string, index: number) => void,
    handleDragStart: (e: React.DragEvent<HTMLLIElement>, item: ItemTypes) => void,
    handleDragOver: (e: React.DragEvent<HTMLLIElement>) => void,
    handleDrag: (e: React.DragEvent<HTMLLIElement>, item: ItemTypes) => void,
}

export function ModalItem(
    {
        item,
        type,
        index,
        editItem,
        handleDragStart,
        handleDragOver,
        handleDrag
    }: ModalItemProps): JSX.Element {
    const checkType = (): boolean => {
        if (type === UsedItemTypes.TASK)
            return true

        return false
    }

    return (
        <li
            css={liCss}
            draggable={true}
            onDragStart={(e) => checkType() ? handleDragStart(e, item) : false}
            onDragOver={(e) => checkType() ? handleDragOver(e) : false}
            onDrop={(e) => checkType() ? handleDrag(e, item) : false}
        >
            <div css={itemSectionCss}>
                <CalendarItem item={item} sectionType='large' />
                <button css={buttonCss} onClick={() => editItem(item, type, index)}>
                    Edit
                </button>
            </div>
        </li>
    )
}
