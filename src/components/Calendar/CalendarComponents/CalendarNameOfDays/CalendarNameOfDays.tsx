import React from 'react'

import { css } from '@emotion/react'
import { startOfWeek, format, addDays } from 'date-fns'

const daysSectionCss = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 20px 12px;
`

const dayCss = css`
  font-size: 0.7em;
  line-height: 0.7em;
`

type CalendarNameOfDaysProps = {
    month: Date
}

export function CalendarNameOfDays({ month }: CalendarNameOfDaysProps): JSX.Element {
    const getNameOfDays = () => {
        const dateFormat = 'EEEE'
        const startDate = startOfWeek(month)
        const days = []

        for (let i = 0; i < 7; i++) {
            days.push(format(addDays(startDate, i), dateFormat))
        }

        return days
    }

    const nameOfDaysRender = () => {
        return getNameOfDays().map((value, index) => (
            <div css={dayCss} key={index}>{value}</div>
        ))
    }

    return(
        <div css={daysSectionCss}>{ nameOfDaysRender() }</div>
    )
}
