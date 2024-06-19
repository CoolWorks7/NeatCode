import React from 'react'
import styles from './page.module.css'
import Link from 'next/link'

export default function Footer() {
  
  return (
    <footer className={styles.footer}>
      <div className={styles.rights}>@{new Date().getFullYear()} All rights reserved</div>
      <Link href='#' className={styles.creator}>Cool Works</Link>
    </footer>
  )
}
