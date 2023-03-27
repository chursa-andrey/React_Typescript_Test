import React, {useContext, useEffect, useState} from 'react'

import {css} from '@emotion/react'
import {format} from 'date-fns'

import {AppContext, Types} from './AppStore'
import {CalendarHead} from './CalendarComponents/CalendarHead/CalendarHead'
import {CalendarNameOfDays} from './CalendarComponents/CalendarNameOfDays/CalendarNameOfDays'
import {CalendarBody} from './CalendarComponents/CalendarBody/CalendarBody'
import {CalendarModal} from './CalendarComponents/CalendarModal/CalendarModal'
import {CalendarActionBar} from './CalendarComponents/CalendarActionBar/CalendarActionBar'
import {CalendarFooter} from './CalendarComponents/CalendarFooter/CalendarFooter'
import {DefaultValues, UsedItemTypes} from './CalendarHelper'

const mainCalendarCss = css`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 800px; 
  border: 1px solid white;
`

export function Calendar(): JSX.Element {
    const {state, dispatch} = useContext(AppContext)
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date)
    const storageName = format(state.day, DefaultValues.DATE_FORMAT)
        .replaceAll(' ', '_')

    const changeMonth = (newDate: Date): void => {
        setCurrentMonth(newDate)
    }

    const getHolidays = async () => {
        await fetch(DefaultValues.HOLIDAYS_API_URL)
            .then(res => res.json())
            .then(holidays => {
                dispatch({type: Types.HOLIDAYS, payload: holidays})
            })
    }

    useEffect(() => {
        getHolidays()
    }, [state.holidays.length])

    return (
        <div id="calendar-main" css={mainCalendarCss}>
            <CalendarActionBar />
            <CalendarHead
                month={currentMonth}
                changeMonth={changeMonth}
            />
            <CalendarNameOfDays
                month={currentMonth}
            />
            <CalendarBody month={currentMonth} />
            { state.taskModal && (
                <CalendarModal
                    type={UsedItemTypes.TASK}
                    storageName={storageName}
                />
            )}
            <CalendarFooter />
        </div>
    )
}
