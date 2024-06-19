'use client'

import React, { useEffect, useState } from 'react'
import styles from './page.module.css'
import Header from '@/app/_components/header'
import Footer from '@/app/_components/footer'
import { BlobElem } from '@/app/page'
import Input from '@/app/_components/input'
import Link from 'next/link'
import Notice from '@/app/_components/notice'
import { useRouter } from 'next/navigation'
import { logIn, logOut } from '@/redux/features/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getAuth } from '@/redux/features/authSlice'


export default function Login() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.authReducer.user)
  const router = useRouter()

  const [formData, setFormData] = useState({
    email:'', password:''
  })
  const [error, setError] = useState('')


  useEffect(() => {
    if (!user.isAuth) dispatch(getAuth())
  }, [0])
  
  useEffect(() => {
    if (user.isAuth) router.push('/user/problems')
  }, [user, router])


  function updateForm(e) {
    const {name, value} = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleLogin(e) {
    e.preventDefault()

    // checking if any attribute is empty
    for (const key in formData) {
      if (formData[key].trim() == '') return setError(`${key} cannot be empty!`)
    }
    if (formData.password.trim().length < 6) return setError(`Password Cannot be less than 6 letters!`)

    // calling the api
    let result = await fetch('https://neat-code.netlify.app/api/login', {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    const data = await result.json()

    // if success is false => return
    if (!data.success) return setError(data.message)
    delete data.payload.password

    dispatch(logIn(data.payload))

    // route to problems page
    router.push('/user/problems')
  }

  return (
    <main className={styles.main}>
      <Header active='login'/>
      <div className={styles.container}>
        <form className={styles.form} action='#'>
          <h1>Log in to your Account!</h1>
          
          <div className={styles.details}>
            <Input type='email' label='Email' value={formData.email} name='email' setValue={updateForm}/>
            <Input type='password' label='Password' value={formData.password} name='password' setValue={updateForm}/>
          </div>

          <div className={styles.bottom}>
            <div className={styles.note}>
              {"Don't have an Account??"}
              <Link href='/user/register'>Register</Link>
            </div>

            <button onClick={handleLogin}>Login</button>
          </div>
        </form>

        {error != '' && <Notice text={error} setText={setError}/>}

      </div>
      <BlobElem />
    </main>
  )
}
