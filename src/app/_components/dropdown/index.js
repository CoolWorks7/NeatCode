'use client'

import React, { useState } from 'react'
import styles from './page.module.css'
import { FaCaretDown } from "react-icons/fa";
import { nanoid } from '@reduxjs/toolkit';

export default function Dropdown({list, selected, setSelected}) {
    const [shown, setShown] = useState(false)

    const listElements = list.map(item => {
        return (
            <div key={nanoid()} className={styles.item} onClick={() => {
                setSelected(item)
                setShown(false)
            }}>
                {item}
            </div>
        )
    })

    return (
        <div className={styles.dropdown}>
            <div className={styles.box} onClick={() => {
                setShown(prev => !prev)
            }}>
                {selected}
                <FaCaretDown />
            </div>

            {shown && 
                <div className={styles.option}>
                    {listElements}
                </div>
            }
        </div>
    )
}
