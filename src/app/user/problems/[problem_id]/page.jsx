'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAuth } from '@/redux/features/authSlice'
import styles from './page.module.css'
import Header from '@/app/_components/header'
import FileName from '@/app/_components/fileName'
import { IoAdd } from 'react-icons/io5'
import { Editor } from '@monaco-editor/react'
import { nanoid } from '@reduxjs/toolkit'
import { FaEdit } from 'react-icons/fa'
import { GoKebabHorizontal } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri"
import { IoClose } from "react-icons/io5"
import Notice from '@/app/_components/notice'


export default function Problem({params}) {
    const router = useRouter()
    const dispatch = useDispatch()
    const user = useSelector(state => state.authReducer.user)

    const [error, setError] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [deleteBox, setDeleteBox] = useState(false)
    const [problem, setProblem] = useState({
        title: '', link: '', tags: [], tag: '', description: '',
        currentCodeNo: 0,
        files: [{
            name: 'New Page',
            code: '',
            lang: ''
        }]
    })


    useEffect(() => {
        if (!user.isAuth) dispatch(getAuth())
    }, [0])
  
    useEffect(() => {
        let res = localStorage.getItem('NeatCodeUser')
        if (res) {
            res = JSON.parse(res)
            if (res.email == '') router.push('/')
            else handleGetProblem(res._id)
        }
        else router.push('/')
    }, [user, router])

    async function handleGetProblem(id) {
        let result = await fetch(`/api/problems/${id}/${params.problem_id}`, {
            method: "GET"
        })
        let res = await result.json()
        if (res.success) setProblem(res.result)
        else router.replace('/user/problems')
    }

    async function deleteProblem() {
        let result = await fetch(`/api/problems/${user._id}/${params.problem_id}`, {
            method: "DELETE"
        })
        let res = await result.json()
        if (res.success) router.replace('/user/problems')
        else setError("Failed to Delete!")
    }

    let fileNameElements = problem?.files?.map((file, i) => {
        return <FileName key={nanoid()} formData={problem} setFormData={setProblem} file={file} i={i} />
    })

    let tagElements = problem?.tags.map(tag => {
        return <div key={nanoid()} className={styles.tag}>{tag}</div>
    })

    return (
    <main className={styles.main}>
        <Header active='problems'/>

        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.top}>
                    <span>
                        <h1>{problem?.title} </h1>
                        {
                        showMenu?
                        <>
                            <IoClose className={styles.kebab} onClick={() => setShowMenu(prev => !prev) }/>
                            <div className={styles.menu}>
                                <button className={styles.elem} onClick={() => router.push('/user/editProblem/'+params.problem_id)}><FaEdit /> Edit</button>
                                <button className={styles.elem} onClick={() => setDeleteBox(true)}><RiDeleteBin6Line /> Delete</button>
                            </div>
                        </> :
                        <GoKebabHorizontal className={styles.kebab} onClick={() => setShowMenu(prev => !prev)}/>
                        }

                    </span>
                    <div className={styles.info}>
                        <div className={styles.difficulty} data-mode={problem.level}>{problem.level}</div>
                        <a href={problem.link}>{problem.platform}</a>
                    </div>
                </div>

                <div className={styles.tags}>
                    {tagElements}
                </div>

                <div className={styles.description}>{problem.description}</div>

                <button className={styles.edit} onClick={() => router.push('/user/editProblem/'+params.problem_id)}>
                    <FaEdit /> Edit
                </button>
            </div>

            <div className={styles.right}>
                <div className={styles.filesList}>
                {fileNameElements}
                <span className={styles.addFile} onClick={() => {
                    setProblem(prev => {
                    return {...prev, files:[...prev.files, { name: 'New Page', code: '', language: '' }], currentCodeNo: prev.files.length}
                    })
                }}><IoAdd /></span>
                </div>
                <Editor
                    height={'90%'}
                    theme="vs-dark"
                    language={problem.files && problem?.files[problem?.currentCodeNo]?.language}
                    defaultValue="" 
                    value={problem?.files[problem?.currentCodeNo]?.code}
                    options={{fontFamily: 'Fira Code, Consolas, "Courier New", monospace', fontWeight: 500, padding: '10px', tabSize: 6}}
                    
                    onChange={(value) => {
                        setProblem(prev => {
                            let files = JSON.parse(JSON.stringify(prev.files))
                            files[prev.currentCodeNo].code = value
                            return { ...prev, files }
                        })
                    }}
                />
            </div>

            {deleteBox && 
            <div className={styles.confirmContainer}>
                <div className={styles.confirm}>
                    Do you want to Delete!
                    <div className={styles.buttons}>
                        <button onClick={() => {
                            deleteProblem()
                        }}>Yes</button>
                        <button onClick={() => {
                            setDeleteBox(false)
                            setShowMenu(false)
                        }}>No</button>
                    </div>
                </div>
            </div>}

        </div>
          
        {error != '' && <Notice text={error} setText={setError}/>}
    </main>)
}
