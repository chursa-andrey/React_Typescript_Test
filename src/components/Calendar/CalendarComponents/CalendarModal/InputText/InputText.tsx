import React from 'react'

import { css } from '@emotion/react'

const lableCss = css`
  padding-right: 10px;
  color: #282c34;
  font-size: 0.6em;
  font-weight: bold;
`

const inputCss = css`
  width: 100%;
  box-sizing: border-box;
  margin-top: 5px;
  padding: 5px;
  font-size: 0.7em;
`

type InputTextProps = {
    type: string,
    inputTextRef: React.RefObject<HTMLInputElement>
}

export function InputText({type, inputTextRef}: InputTextProps): JSX.Element {
    return (
        <div>
            <label css={lableCss}>{type} Name</label>
            <input
                css={inputCss}
                ref={inputTextRef}
                type='test'
                id='name_of_item'
                name='name_of_item'
                autoComplete='off'
            />
        </div>
    )
}
