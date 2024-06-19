import React from 'react'
import styles from './page.module.css'

export default function Input({type, label, name, value, setValue, customWidth=true}) {
  return (
    <div className={styles.inputBox}>
      <input
        className={styles.input}
        placeholder=' '
        type={type}
        name={name}
        value={value}
        onChange={(e) => setValue(e)}
        style={customWidth? {width: 'var(--input-width)'} : {}}
        autoComplete='off'
      />
      <label>{label}</label>
    </div>
  )
}
