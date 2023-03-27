import React from 'react'

import { css } from '@emotion/react'
import { DefaultValues } from '../../../CalendarHelper'

const lableCss = css`
  padding-right: 10px;
  color: #282c34;
  font-size: 0.6em;
  font-weight: bold;
`

const inputColorCss = css`
  width: 30px;
  margin-top: 10px;
`

type InputColorProps = {
    inputColorRef: React.RefObject<HTMLInputElement>
}

export function InputColor({ inputColorRef }: InputColorProps): JSX.Element {
    return (
        <div>
            <label css={lableCss}>Label Color</label>
            <input
                css={inputColorCss}
                ref={inputColorRef}
                id="color"
                name="color"
                type="color"
                defaultValue={DefaultValues.COLOR}
            />
        </div>
    )
}
