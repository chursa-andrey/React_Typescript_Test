import React, {useContext} from 'react'

import stiled from '@emotion/styled'
import { css } from '@emotion/react'
import { AppContext } from '../../AppStore'
import { DefaultValues, ItemTypes } from '../../CalendarHelper'

const itemSectionCss = css` 
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: nowrap;
  font-size: 1em;
`

type labelsSectionProps = {
    typeCI: boolean
}

const LabelsSection = stiled('div')<labelsSectionProps>`
  display: flex;
  margin-top: ${props => props.typeCI ? '4' : '0'}px;
  margin-right: 5px;
  padding: 2px;
  background: ${props => props.typeCI ? 'none' : 'white'};
  border-radius: 2px;
`

const itemCss = css`
  margin: 0;
  padding: 0;
  text-align: left;
  line-height: 0.8em;
`

type LabelProps = {
    color: string,
    typeCI: boolean
}

const Label = stiled('span')<LabelProps>`
    display: block;
    width: ${props => props.typeCI ? '12' : '6'}px;
    height: ${props => props.typeCI ? '12' : '6'}px;
    margin-right: ${props => props.typeCI ? '4' : '2'}px;
    border-radius: ${props => props.typeCI ? '6' : '3'}px;
    background: ${props => props.color};
    &:last-child {
        margin-right: 0;    
    }
`

type ItemProps = {
    typeCI: boolean,
    color: string
}

const Item = stiled('p')<ItemProps>`
    margin: 0;
    padding: 0;
    color: ${props => props.typeCI ? props.color : '#fff'};
`

type CalendarItemProps = {
    item: ItemTypes,
    sectionType?: 'large' | 'small'
}

export function CalendarItem({ item, sectionType = 'large' }: CalendarItemProps): JSX.Element {
    const { state } = useContext(AppContext)
    const typeCI = sectionType === 'large' ? true : false

    const labelsRender = (): JSX.Element => {
        if('getLabelIndexes' in item){
            const allLabels = state.mainStore.getItemsByStorageName(DefaultValues.LABEL_STORAGE_NAME)
            const labelsIndexes = item.getLabelIndexes()

            const labels = labelsIndexes.map((index) => (
                <Label
                    key={'key_' + Date.now() + '_' + index}
                    color={allLabels[index].getColor()}
                    title={allLabels[index].getItem()}
                    typeCI={typeCI}
                >
                </Label>
            ))
            return <>{labels}</>
        }else{
            return <></>
        }
    }

    return (
        <div css={itemSectionCss}>
            <LabelsSection typeCI={typeCI}>{labelsRender()}</LabelsSection>
            <div css={itemCss}>
                <Item typeCI={typeCI} color={item.getColor()}>
                    {item.getItem()}
                </Item>
            </div>
        </div>
    )
}
