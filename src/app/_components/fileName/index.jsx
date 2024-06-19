import { nanoid } from '@reduxjs/toolkit'
import React, { useState } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import styles from './page.module.css'

export default function FileName({formData, setFormData, file, i}) {
    const [change, setChange] = useState(false)


    return (
      <span 
        className={formData.currentCodeNo == i? styles.active : styles.normal}
        onClick={() => {
          setFormData((prev) => ({ ...prev, currentCodeNo: i}))
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          if (formData.currentCodeNo != i) return
          setChange(true)
        }}
        onMouseLeave={() => setChange(false)}
      >

        {change? <input 
            placeholder={file.name}
            autoCorrect='off'
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
                if (e.keyCode == 13) {
                    const {value} = e.target
                    if (value.trim() == '') return

                    let index = value.indexOf('.')
                    let extension = index > -1? value.slice(index+1, value.length) : ''

                    let language = ''
                    if (extension == 'js') language = 'javascript'
                    else if (extension == 'java') language = 'java'
                    else if (extension == 'c') language = 'c'
                    else if (extension == 'cpp') language = 'cpp'
                    else if (extension == 'html') language = 'html'
                    else if (extension == 'css') language = 'css'
                    else if (extension == 'py') language = 'python'
                    else language = ''
                    // console.log(language);
                        
                    setChange(false)
                    setFormData(prev => {
                        let files = JSON.parse(JSON.stringify(prev.files))
                        files[prev.currentCodeNo].name = value
                        files[prev.currentCodeNo].language = language

                        console.log(files[prev.currentCodeNo]);

                        return { ...prev, files }
                    })
                }
            }}/> : 
            file.name 
        }


        <IoCloseOutline onClick={(e) => {
          e.stopPropagation()
          if (formData.files.length == 1) return

          setFormData(prev => {  
            const files = JSON.parse(JSON.stringify(prev.files))
            files.splice(i, 1)
            
            let newCodeNo = prev.currentCodeNo
            if (prev.currentCodeNo > i) newCodeNo -= 1
            else if (prev.currentCodeNo == i) newCodeNo = files.length - 1

            return { ...prev,  files: [...files], currentCodeNo: newCodeNo}
          })
        }}/>
      </span>
    )
}
