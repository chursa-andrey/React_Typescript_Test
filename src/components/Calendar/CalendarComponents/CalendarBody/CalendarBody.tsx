import React, {useContext, useState} from 'react'

import {css} from '@emotion/react'
import {addDays, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek} from 'date-fns'
import { AppContext, Types } from '../../AppStore'
import {CalendarDay} from '../CalendarDay/CalendarDay'

const daysRow = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`

type CalendarBodyProps = {
    month: Date
}

export function CalendarBody({ month }: CalendarBodyProps): JSX.Element {
    const {state, dispatch} = useContext(AppContext)
    const [transfer, setTransfer] = useState<number>(0)
    let currentStorageName: string

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, storageName: string): void => {
        currentStorageName = storageName
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDrag = (e: React.DragEvent<HTMLDivElement>, storageName: string): void => {
        e.preventDefault()
        if(currentStorageName !== storageName){
            const itemsFrom = state.mainStore.getItemsByStorageName(currentStorageName)
            const itemsTo = state.mainStore.getItemsByStorageName(storageName)
            const newItems = itemsTo.concat(itemsFrom)
            const updatedStorage = state.mainStore
                .deleteByStorageName(currentStorageName)
                .setItems(newItems, storageName)

            dispatch({type: Types.MAIN_STORE, payload: updatedStorage})
            setTransfer(transfer + 1)
        }
    }

    const daysRender = (): JSX.Element => {
        const monthStart = startOfMonth(month)
        const monthEnd = endOfMonth(monthStart)
        const startDate = startOfWeek(monthStart)
        const endDate = endOfWeek(monthEnd)
        const dateFormat = 'd'
        const rows = [];

        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const formattedDate = format(day, dateFormat)
                const key = new Date(day).valueOf()

                days.push(
                    <CalendarDay
                        key={key}
                        day={day}
                        formattedDate={formattedDate}
                        isSameMonth={isSameMonth(day, monthStart)}
                        handleDragStart={handleDragStart}
                        handleDragOver={handleDragOver}
                        handleDrag={handleDrag}
                    />
                )
                day = addDays(day, 1)
            }

            rows.push(
                <div css={daysRow} key={"key_" + day}>
                    { days }
                </div>
            )
            days = []
        }

        return <>{rows}</>
    }

    return (
        <div>{ daysRender() }</div>
    )
}
