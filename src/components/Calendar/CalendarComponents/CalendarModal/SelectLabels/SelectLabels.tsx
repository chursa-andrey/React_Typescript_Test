import React, { useContext } from 'react'

import stiled from '@emotion/styled'
import { css } from '@emotion/react'
import { AppContext } from '../../../AppStore'
import { Storage, DefaultValues } from '../../../CalendarHelper'

type SelectSectionProps = {
    typeMS: boolean
}

const SelectSection = stiled('div')<SelectSectionProps>`
  padding-top: ${props => props.typeMS ? '10' : '0'}px;
`

const lableCss = css`
  float: left;
  padding-right: 10px;
  color: #282c34;
  font-size: 0.6em;
  font-weight: bold;
`

type SelectProps = {
    typeMS: boolean
}

const Select = stiled('select')<SelectProps>`
  width: 244px;
  height: ${props => props.typeMS ? '54' : '48'}px;
`

type OptionProps = {
    color: string
}

const Option = stiled('option')<OptionProps>`
  color: ${props => props.color};
`

type SelectLabelsProps = {
    selectRef: React.RefObject<HTMLSelectElement>,
    selectType?: 'Modal' | 'ActionBar',
    handleChange?: () => void,
    handleBlur?: () => void
}

export function SelectLabels(
    {
        selectRef,
        selectType = 'Modal',
        handleChange,
        handleBlur
    }: SelectLabelsProps): JSX.Element {
    const {state, dispatch} = useContext(AppContext)
    const typeMS = selectType === 'Modal' ? true : false

    const SelectRender = (): JSX.Element => {
        const items = state.mainStore.getItemsByStorageName(DefaultValues.LABEL_STORAGE_NAME)
        if(items.length){
            const options = items.map((item, index) => (
                <Option
                    key={'key_' + Date.now() + '_' + index}
                    color={item.getColor()}
                    value={index}
                >
                    {item.getItem()}
                </Option>
            ))

            return (
                <Select
                    typeMS={typeMS}
                    ref={selectRef}
                    id="multi-select"
                    name="multi-select"
                    multiple
                    onChange={() => (!typeMS && typeof handleChange == 'function') ? handleChange() : null}
                    onBlur={() => (!typeMS && typeof handleBlur == 'function') ? handleBlur(): null}
                >
                    { options }
                </Select>
            )
        }

        return <></>
    }

    return (
        <SelectSection typeMS={typeMS}>
            {typeMS && (
                <label css={lableCss}>Select Labels</label>
            )}
            { SelectRender() }
        </SelectSection>
    )
}
