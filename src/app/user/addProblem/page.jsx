'use client'

import React, { useState, useEffect } from 'react'
import styles from './page.module.css'
import Header from '@/app/_components/header'
import { Editor } from '@monaco-editor/react'
import Input from '@/app/_components/input'
import { IoAdd, IoCloseOutline } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { getAuth } from '@/redux/features/authSlice'
import Dropdown from '@/app/_components/dropdown'
import { nanoid } from '@reduxjs/toolkit'
import FileName from '@/app/_components/fileName'
import Notice from '@/app/_components/notice'


export default function AddProblem() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.authReducer.user)
  const router = useRouter()
  
  const [error, setError] = useState('')
  const [level, setLevel] = useState('Easy')
  const [platform, setPlatform] = useState('LeetCode')
  const [formData, setFormData] = useState({
    title: '', link: '', tags: [], tag: '', description: '',
    currentCodeNo: 0,
    files: [{
        name: 'New Page',
        code: '',
        lang: ''
      }]
  })

  // console.log(formData.files[formData.currentCodeNo].language);

  useEffect(() => {
      if (!user.isAuth) dispatch(getAuth())
      // console.log(user);
  }, [])

  useEffect(() => {
      let res = localStorage.getItem('NeatCodeUser')
      // console.log(res);
      if (res) {
          res = JSON.parse(res)
          if (res.email == '') router.push('/')
      }
      else router.push('/')
  }, [])


  function updateForm(e) {
    const {name, value} = e.target
    if (name == 'tag') {
      let trimmed = value.trim().replaceAll(',', '')
      if (trimmed.length != 0 && value[value.length - 1] == ',') {
        return setFormData(prev => ({ ...prev, [name]: '', tags: [...prev.tags, trimmed] }))
      }
      else {
        return setFormData(prev => ({...prev, [name]: value }))
      }
    }

    else setFormData(prev => ({ ...prev, [name]: value }))
  }


  async function handleAddProblem() {
    if (formData.title.trim() == '') return setError('Title cannot be empty!')
    if (formData.link.trim() == '') return setError('Link cannot be empty!')
    if (formData.description.trim() == '') return setError('Description cannot be empty!')
    
    const payload = {
      title: formData.title,
      link: formData.link,
      description: formData.description,
      tags: formData.tags,
      files: formData.files,
      level,
      platform
    }

    let result = await fetch(`/api/problems/${user._id}/addProblem`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    let res = await result.json()
    if (res.success) router.replace('/user/problems', {scroll: true})
    else {
      setError('An error occured!')
      setFormData({
        title: '', link: '', tags: [], tag: '', description: '',
        currentCodeNo: 0,
        files: [{
            name: 'New Page',
            code: '',
            language: ''
          }]
      })
    }
  }


  let tagElements = formData.tags.map((tag, i) => {
    return (
      <div key={nanoid()} className={styles.tag}>
        {tag}
        <IoCloseOutline onClick={() => {
          setFormData(prev => {
            const tags = JSON.parse(JSON.stringify(prev.tags))
            tags.splice(i, 1)
            return { ...prev, tags }
          })
        }}/>
      </div>
    )
  })


  let fileNameElements = formData.files.map((file, i) => {
    return <FileName key={nanoid()} formData={formData} setFormData={setFormData} file={file} i={i} />
  })

  return (
    <main className={styles.main}>
        <Header active='addProblem'/>

        <div className={styles.container}>
          <div className={styles.left}>
            <h1>Add New Problem</h1>

            <Input value={formData.title} setValue={updateForm} name='title' type='text' label='Title' customWidth={false} />
            <Input value={formData.link} setValue={updateForm} name='link' type='text' label='Link' customWidth={false} />
            <Input value={formData.description} setValue={updateForm} name='description' type='text' label='Description' customWidth={false} />

            <div className={styles.tagArea}>
              <div className={styles.options}>
                <Dropdown list={['LeetCode', 'Hacker Rank']} selected={platform} setSelected={setPlatform} />
                {/* <Dropdown list={['javascript', 'python', 'cpp', 'java', 'html', 'css']} selected={language} setSelected={setLanguage} />   */}
                <Dropdown list={['Easy', 'Medium', 'Hard']} selected={level} setSelected={setLevel} />  
              </div>

              <input value={formData.tag} onChange={updateForm} name='tag' placeholder='Tags' 
                autoComplete='off' onKeyDown={(e) => {
                if (e.keyCode == 13) {
                  const {name, value} = e.target
                  let trimmed = value.trim().replaceAll(',', '')
                  if (trimmed.length == 0) return
                  setFormData(prev => ({ ...prev, [name]: '', tags: [...prev.tags, trimmed]}))
                }
              }}/>
              <div className={styles.tags}>{tagElements}</div>
            </div>

            <button onClick={handleAddProblem}>Upload</button>
          </div>

          <div className={styles.right}>
            <div className={styles.filesList}>
              {fileNameElements}
              <span className={styles.addFile} onClick={() => {
                setFormData(prev => {
                  return {...prev, files:[...prev.files, { name: 'New Page', code: '', language: '' }], currentCodeNo: prev.files.length}
                })
              }}><IoAdd /></span>
            </div>
            <Editor
                height={'90%'}
                theme="vs-dark"
                language={formData.files[formData.currentCodeNo]?.language}
                defaultValue="" 
                value={formData.files[formData.currentCodeNo]?.code}
                options={{fontFamily: 'Fira Code, Consolas, "Courier New", monospace', fontWeight: 500, padding: '10px', tabSize: 6}}
                
                onChange={(value) => {
                  setFormData(prev => {
                    let files = JSON.parse(JSON.stringify(prev.files))
                    files[prev.currentCodeNo].code = value
                    return { ...prev, files }
                  })
                  // console.log(value);
                  // setEditorValue(prev => ({...prev, [fileOpened]: value}))
                }}
            />
          </div>
        </div>

        {error != '' && <Notice text={error} setText={setError}/>}
    </main>
  )
}
