import React, { ChangeEvent, useContext } from 'react'

import * as htmlToImage from 'html-to-image'
import { css } from '@emotion/react'
import { AppContext, Types } from '../../AppStore'
import { Storage, Task, Label, DefaultValues } from '../../CalendarHelper'

const footerCss = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: 15px 20px 15px;
  border-top: 1px solid white;
  button{
    padding: 5px 10px;
  }
`

const uploadFileSectionCss = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  label{
    padding: 8px 10px;
    font-size: 0.7em;
    background-color: buttonface;
    color: #333;
    font-size: 0.53em;
    text-align: center;
    border-width: 2px;
    border-style: outset;
    border-color: #000;
    border-image: initial;
    border-radius: 3px;
  }
  input{
    display: none;
  }
`

export function CalendarFooter(): JSX.Element {
    const {state, dispatch} = useContext(AppContext)
    const downloadCalendarData = (): void => {
        const fileData = JSON.stringify(state.mainStore);
        const blob = new Blob([fileData], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.download = "calendar-data.json"
        link.href = url
        link.click()
    }

    const uploadCalendarData = (e: ChangeEvent<HTMLInputElement>): void => {
        if(e.currentTarget?.files?.length){
            const fileReader = new FileReader()
            fileReader.readAsText(e.currentTarget.files[0], "UTF-8")
            fileReader.onload = e => {
                if(e?.target?.result){
                    const objData = JSON.parse(e.target.result.toString())
                    setNewStorage(objData)
                }
            };
        }
    }

    const setNewStorage = (obj: any): void => {
        if('_items' in obj){
            const items = obj._items
            const uploadedStorage = new Storage()
            Object.keys(items).forEach(key => {
                if(key === DefaultValues.LABEL_STORAGE_NAME){
                    for(let val of items[key]){
                        if('_label' in val && '_color' in val)
                            uploadedStorage.addItem(new Label(val._label, val._color), key)
                    }
                }else{
                    for(let val of items[key]){
                        if('_task' in val && '_labelIndexes' in val)
                            uploadedStorage.addItem(new Task(val._task, val._labelIndexes), key)
                    }
                }
            })

            dispatch({type: Types.MAIN_STORE, payload: uploadedStorage})
        }
    }

    const downloadAsImage = (): void => {
        const calendar = document.getElementById('calendar-main')
        if(calendar){
            htmlToImage.toBlob(calendar).then(function (blob) {
                if(blob){
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement("a")
                    link.download = "calendar.png"
                    link.href = url
                    link.click()
                }
            })
        }
    }

    return (
        <div css={footerCss}>
            <button onClick={downloadCalendarData}>Download Calendar Data</button>
            <div css={uploadFileSectionCss}>
                <label>Upload Calendar Data
                    <input
                        type="file"
                        name="Upload File"
                        accept="application/json"
                        onChange={uploadCalendarData}
                    />
                </label>
            </div>
            <button onClick={downloadAsImage}>Download as image</button>
        </div>
    )
}
