'use client'

import React, { useEffect, useState } from 'react'
import styles from '../login/page.module.css'
import Header from '@/app/_components/header'
import Footer from '@/app/_components/footer'
import { BlobElem } from '@/app/page'
import Input from '@/app/_components/input'
import Link from 'next/link'
import Notice from '@/app/_components/notice'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { getAuth, logIn } from '@/redux/features/authSlice'


export default function Register() {
  const user = useSelector(state => state.authReducer.user)
  const dispatch = useDispatch()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name:'', email:'', password:'', confirmPassword:''
  })
  const [error, setError] = useState(false)


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

  async function handleRegistration(e) {
    e.preventDefault()

    // checking if any attribute is empty
    for (const key in formData) {
      if (formData[key].trim() == '') return setError(`${key} cannot be empty!`)
    }
    if (formData.password != formData.confirmPassword) return setError(`Password & Confirm Password do not match!`)
    if (formData.password.trim().length < 6) return setError(`Password Cannot be less than 6 letters!`)

    // calling the api
    const res = await fetch(`/api/register`, {
      method: 'POST',
      body: JSON.stringify({name: formData.name, email: formData.email, password: formData.password})
    })
    const data = await res.json()

    // if success is false => return
    if (!data.success) return setError(data.message)
    delete data.payload.password
    
    dispatch(logIn(data.payload))

    // route to problems page
    router.push('/user/problems')
  }

  return (
    <main className={styles.main}>
      <Header active='register'/>

      <div className={styles.container}>
        <form className={styles.form} action='#'>
          <h1>Create Your Account!</h1>
          
          <div className={styles.details}>
            <Input type='text' label='Full Name' value={formData.name} name='name' setValue={updateForm}/>
            <Input type='email' label='Email' value={formData.email} name='email' setValue={updateForm}/>
            <Input type='password' label='Password' value={formData.password} name='password' setValue={updateForm}/>
            <Input type='password' label='Confirm Password' value={formData.confirmPassword} name='confirmPassword' setValue={updateForm}/>
          </div>

          <div className={styles.bottom}>
            <div className={styles.note}>
              Already Have an Account? 
              <Link href='/user/login'>Login</Link>
            </div>
            <button onClick={handleRegistration}>Register</button>
          </div>
        </form>

        {error != '' && <Notice text={error} setText={setError}/>}

      </div>
      <BlobElem />
    </main>
  )
}
