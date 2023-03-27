import React from 'react'

import { css } from '@emotion/react'
import { format, addMonths, subMonths } from 'date-fns'

const calendarHeadCss = css `
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 20px;
  border-bottom: 1px solid white;
`

const buttonCss = css`
  margin: 0;
  padding: 5px;
  border: none;
  background: none;
  font-size: 0.6em;
  color: white;
  cursor: pointer;
  &:active {
    opacity: 0.5;
  }
`

const monthYearCss = css`
  font-size: 0.7em;
  font-weight: bold;
`

type CalendarHeadProps = {
    month: Date,
    changeMonth: (date: Date) => void
}

export function CalendarHead({month, changeMonth}: CalendarHeadProps): JSX.Element {
    const dateFormat = 'MMMM yyyy'

    const nextMonth = () => {
        changeMonth(addMonths(month, 1))
    }

    const prevMonth = () => {
        changeMonth(subMonths(month, 1))
    }

    return (
        <div css={calendarHeadCss}>
            <button css={buttonCss} onClick={prevMonth}>&#9668;</button>
            <div css={monthYearCss}>
                {format(month, dateFormat)}
            </div>
            <button css={buttonCss} onClick={nextMonth}>&#9658;</button>
        </div>
    )
}
