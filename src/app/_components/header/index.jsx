'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from "./page.module.css";
import Link from 'next/link';
import { SlMenu } from "react-icons/sl";
import { GrClose } from "react-icons/gr";
import { useSelector, useDispatch } from 'react-redux';
import { FiPower } from "react-icons/fi";
import { logOut } from '@/redux/features/authSlice';

export default function Header({active}) {
  const user = useSelector(state => state.authReducer.user)
  const dispatch = useDispatch()
  const [menuOpened, setMenuOpened] = useState(false)

  return (
    <>
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image 
          src='/Logo.svg'    
          width='25'
          height='25'
          alt="Logo"
        />
        <span>Neat Code</span>
      </div>

      <div className={`${styles.menu} ${styles.sp2}`}>
        <li className={active == 'home' && styles.active}><Link href='/'>Home</Link></li>
        <li className={active == 'problems' && styles.active}><Link href='/user/problems'>Problems</Link></li>
        <li className={active == 'tasks' && styles.active}><Link href='/user/tasks'>Tasks</Link></li>
      </div>
        
      <div className={styles.menu}>
        {!user.isAuth? <>
          <li className={active == 'login' && styles.active}><Link href='/user/login'>Login</Link></li>
          <li className={`${styles.register} ${active == 'register'? styles.active : ''}`}><Link href='/user/register'>Register</Link></li>
        </> :
          <li className={styles.logout}>
            <FiPower onClick={() => dispatch(logOut())} />
            <div className={styles.about}>Log Out</div>
          </li>
        }
      </div>

      {!menuOpened? <SlMenu className={styles.mobileMenuOpen} onClick={() => setMenuOpened(true)} /> :
      <div className={styles.mobileMenu}>
        <GrClose onClick={() => setMenuOpened(false)} className={styles.mobileMenuClose}/>
        <li><Link href='/'>Home</Link></li>
        <li><Link href='/user/problems'>Problems</Link></li>
        <li><Link href='/user/tasks'>Tasks</Link></li>
        <li><Link href='/user/login'>Login</Link></li>
        <li className={styles.register}><Link href='/user/register'>Register</Link></li>
      </div>}

    </header>
    </>
  )
}
