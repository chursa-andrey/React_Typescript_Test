import React, {useContext, useEffect, useState} from 'react'

import stiled from '@emotion/styled'
import { css } from '@emotion/react'
import { format } from 'date-fns'
import { AppContext, Types } from '../../AppStore'
import { CalendarItem } from '../CalendarItem/CalendarItem'
import { DefaultValues } from '../../CalendarHelper'

type dayCellProps = {
    currentDay: boolean
}

const DayCell = stiled('div')<dayCellProps>`
  position: relative;
  width: 100%;
  height: 100px;
  border-top: 1px solid white;
  border-right: 1px solid white;
  background: ${props => props.currentDay ? '#777790' : 'none'};
  &:last-child {
    border-right: none;
  }    
`

const taskSectionCss = css`
  width: 100%;
  height: 100%;
`

type NumberProps = {
    isSameMonth: boolean
}

const Number = stiled('div')<NumberProps>`
  position: absolute;
  top: 5px;
  right: 5px;
  color: ${props => props.isSameMonth ? 'white' : '#aaa'};
  font-weight: ${props => props.isSameMonth ? 'bold' : 'normal'};
  font-size: 0.5em;
`

const ulCss = css`
  width: 75%;
  height: 70px;
  margin: 0;
  padding: 8px 0 0 5px;
  list-style: none;
  font-size: 0.3em;
`

const liCss = css`
  margin-bottom: 2px;
`

const holidayCss = css`
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  padding: 0 5px;
  bottom: 10px;
  left: 0;
  text-align: center;
  color: deeppink;
  font-size: 0.4em;
  line-height: 1.4em;
`

type CalendarDayProps = {
    day: Date,
    isSameMonth: boolean,
    formattedDate: string,
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, storageName: string) => void,
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void,
    handleDrag: (e: React.DragEvent<HTMLDivElement>, storageName: string) => void
}

export function CalendarDay(
    {
        day,
        isSameMonth,
        formattedDate,
        handleDragStart,
        handleDragOver,
        handleDrag
    }: CalendarDayProps
): JSX.Element {
    const {state, dispatch} = useContext(AppContext)
    const [holiday, setHoliday] = useState<string>('')
    const storageName = format(day, DefaultValues.DATE_FORMAT)
        .replaceAll(' ', '_')
    const currentDay = format(new Date(Date.now()), DefaultValues.DATE_FORMAT)

    const checkCurrentDay = (): boolean => {
        if(currentDay === format(day, DefaultValues.DATE_FORMAT)){
            return true
        }else{
            return false
        }
    }

    const tasksRender = (): JSX.Element => {
        const items = state.mainStore.getItemsByStorageName(storageName).map((val, key) => {
            return (
                <li css={liCss} key={'taskKey_' + Date.now() + '_' + key}>
                    <CalendarItem item={val} sectionType={"small"} />
                </li>
            )
        })

        return <ul css={ulCss}>{items}</ul>
    }

    const handleDayCell = () => {
        dispatch({type: Types.LABEL_MODAL, payload: false})
        dispatch({type: Types.SEARCH_MODAL, payload: false})
        dispatch({type: Types.TASK_MODAL, payload: true})
        dispatch({type: Types.DATE, payload: day})
    }

    const getHolidays = () => {
        const dateFprmat = "yyyy-MM-dd"
        const currentDay = format(day, dateFprmat)
        state.holidays.forEach((val) => {
            if(currentDay === val.date){
                setHoliday(val.name)
                console.log(val.name)
            }
        })
    }

    useEffect(() => {
        getHolidays()
    }, )

    return (
        <DayCell currentDay={checkCurrentDay()} onClick={handleDayCell}>
            <Number isSameMonth={isSameMonth}>{formattedDate}</Number>
            <div
                css={taskSectionCss}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, storageName)}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrag(e, storageName)}
            >
                { tasksRender() }
            </div>
            {holiday && (
                <div css={holidayCss}>{holiday}</div>
            )}
        </DayCell>
    )
}
