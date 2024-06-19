import React from 'react'
import styles from './page.module.css'
import { GrClose } from "react-icons/gr";

export default function Notice({text, setText}) {
  return (
    <div className={styles.boxContainer}>
      <div className={styles.box}>
        <div className={styles.title}>
          <span>Alert</span>
          <GrClose onClick={() => setText('')}/>
        </div>

        {text}
      </div>
    </div>
  )
}
