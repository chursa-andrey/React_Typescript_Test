import React, {useState, ChangeEvent, FocusEvent, useRef, useContext} from 'react'

import { css } from '@emotion/react'
import { AppContext, Types } from '../../AppStore'
import { CalendarModal } from '../CalendarModal/CalendarModal'
import { CalendarItem } from '../CalendarItem/CalendarItem'
import { UsedItemTypes, DefaultValues } from '../../CalendarHelper'

const calendarActionBarCss = css `
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 20px 15px;
  border-bottom: 1px solid white;
`

const lableCss = css`
  font-size: 0.8em;

`

const inputCss = css`
  margin-left: 10px;
  padding: 5px;
  font-size: 0.7em;
`

const addEditLabelsSectionCss = css`
  position: relative;
  height: 100%;
`

const buttonCss = css`
  padding: 8px 10px 7px;  
`

const searchModalCss = css`
  width: 535px;
  position: absolute;
  z-index: 100;
  top: 60px;
  left: 90px;
  padding: 20px;
  border-radius: 7px;
  background: rgba(230, 230, 245, 0.95);
  color: #333;
`

const searchSectionCss = css`
  padding-bottom: 15px;
  font-size: 0.6em;
  &:last-child{
    padding-bottom: 0;
  }
  strong {
    display: block;
    width: 100%;
    margin-bottom: 5px;
    text-align: left;
  }
`

const taskSectiobCss = css`
padding-left: 20px;
`

export function CalendarActionBar(): JSX.Element {
    const {state, dispatch} = useContext(AppContext)
    const [searchString, setSearchString] = useState('')
    const searchRef = useRef<HTMLInputElement>(null)
    const selectRef = useRef<HTMLSelectElement>(null)

    let selectedlabels = []

    const searchTasksRender = (): JSX.Element => {
        const tasks = state.mainStore.getOnlyTasks()
        if(Object.keys(tasks).length){
            let flag = 0
            const sortKey = Object.keys(tasks).sort((a,b) => {
                const first = a.replaceAll('_', ' ')
                const second = b.replaceAll('_', ' ')
                const firstDate = new Date(first).getTime()
                const secondDate = new Date(second).getTime()

                return firstDate > secondDate ? 1 : -1
            })

            const matching = sortKey.map((key, num) => {
                const taskGroup = tasks[key]
                const searchTasks = []
                for(let index in taskGroup){
                    if(taskGroup[index].getItem().indexOf(searchString) !== -1){
                        flag = 1
                        searchTasks.push(
                            <CalendarItem
                                key={'key' + Date.now() + '_' + index }
                                item={taskGroup[index]}
                            />
                        )
                    }
                }

                if(searchTasks.length){
                    return (
                        <div css={searchSectionCss} key={'sectionKey' + Date.now() + '_' + num}>
                            <strong>{key.replaceAll('_', ' ')}</strong>
                            <div css={taskSectiobCss}>{searchTasks}</div>
                        </div>
                    )
                }
            })

            if(flag){
                return <>{matching}</>
            }else{
                return <div>Nothing found.</div>
            }
        }else{
            return <div>There are no tasks in the calendar.</div>
        }
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
        if(e.target.value.length > 1){
            setSearchString(e.target.value)
            dispatch({type: Types.SEARCH_MODAL, payload: true})
        }else{
            dispatch({type: Types.SEARCH_MODAL, payload: false})
        }
    }

    const handleSearchFocus = (e: FocusEvent<HTMLInputElement>): void => {
        dispatch({type: Types.TASK_MODAL, payload: false})
        dispatch({type: Types.LABEL_MODAL, payload: false})
    }

    const handleSearchBlur = (): void => {
        dispatch({type: Types.SEARCH_MODAL, payload: false})
    }

    const handleLabelModal = (): void => {
        dispatch({type: Types.SEARCH_MODAL, payload: false})
        dispatch({type: Types.TASK_MODAL, payload: false})
        dispatch({type: Types.LABEL_MODAL, payload: true})
    }

    return (
        <div css={calendarActionBarCss}>
            <div className="searchSection">
                <label css={lableCss}>Search</label>
                <input
                    css={inputCss}
                    ref={searchRef}
                    type='text'
                    onChange={handleSearch}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                />
            </div>
            <div css={addEditLabelsSectionCss}>
                <button css={buttonCss} onClick={handleLabelModal}>
                    Add/Edit Labels
                </button>
                {state.labelModal && (
                    <CalendarModal
                        type={UsedItemTypes.LABEL}
                        storageName={DefaultValues.LABEL_STORAGE_NAME}
                    />
                )}
            </div>
            {state.searchModal && (
                <div css={searchModalCss}>
                    {searchTasksRender()}
                </div>
            )}
        </div>
    )
}
