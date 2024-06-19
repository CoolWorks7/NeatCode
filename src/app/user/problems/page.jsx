'use client'

import React, { useEffect, useState } from 'react'
import styles from './page.module.css'
import Header from '@/app/_components/header'
import { BlobElem } from '@/app/page'
import { useDispatch, useSelector } from 'react-redux'
import { getAuth } from '@/redux/features/authSlice'
import { useRouter } from 'next/navigation'
import { FiSearch } from "react-icons/fi";
import Dropdown from '@/app/_components/dropdown'
import { IoAdd } from 'react-icons/io5'
import { nanoid } from '@reduxjs/toolkit'
import Link from 'next/link'
import Notice from '@/app/_components/notice'

export default function Problems({params}) {
    const {app_url} = process.env
    const [error, setError] = useState('')
    const [orderBy, setOrderBy] = useState('Descending')
    const [selectBy, setSelectBy] = useState('Created At')
    const [problems, setProblems] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    const dispatch = useDispatch()
    const user = useSelector(state => state.authReducer.user)
    const router = useRouter()


    useEffect(() => {
        if (!user.isAuth) dispatch(getAuth())
    }, [0])

    useEffect(() => {
        let res = localStorage.getItem('NeatCodeUser')
        if (res) {
            res = JSON.parse(res)
            if (res.email == '') router.push('/')
            else getProblems(res._id) 
        }
        else router.push('/')
    }, [user, router])    

    async function getProblems(id) {
        let result = await fetch(`${app_url}/api/problems/${id}`, {
            method: 'GET'
        })
        let response = await result.json()
        let {success, problems} = response
        if (success) setProblems(problems)
    }

    let count = {Easy: 0, Medium: 0, Hard: 0}
    problems?.forEach(problem => count[problem.level]++)

    let filteredProblemElements = problems?.filter(({title}) => title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1)
    let sortedProblemElements = filteredProblemElements.sort((a, b) => {
        // if (selectBy == 'Name' && orderBy == 'Ascending') return a.title < b.title
        // else if (selectBy == 'Name' && orderBy == 'Descending') return a.title > b.title
        if (selectBy == 'Created At' && orderBy == 'Ascending') return a.created_at - b.created_at
        else if (selectBy == 'Created At' && orderBy == 'Descending') return b.created_at - a.created_at
        else if (selectBy == 'Last Updated' && orderBy == 'Ascending') return a.last_updated - b.last_updated
        else if (selectBy == 'Last Updated' && orderBy == 'Descending') return b.last_updated - a.last_updated
    })

    let problemElements = sortedProblemElements?.map((problem, i) => {
        let tags = problem.tags.map(tag => {
            return <li key={nanoid()}>{tag}</li>
        })
        let mode = problem.level

        return (
            <div key={nanoid()} className={styles.card}>
                <div className={styles.cardTitle}>
                    <div className={styles.serial}>{i+1}</div>
                    <Link href={`/user/problems/${problem._id}`}>{problem.title}</Link>
                </div>
                <div className={styles.cardTags}>
                    <span>{tags}</span>

                    <span className={styles.additional}>
                        <a href={problem.link} className={styles.platform}>{problem.platform}</a>
                        <div className={styles.difficulty} data-mode={mode}>{problem.level}</div>
                    </span>
                </div>
            </div>
        )
    })

    return (
    <main className={styles.main}>
        <Header active='problems'/>

        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.search}>
                    <input type='text' placeholder='Search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                    <FiSearch className={styles.searchIcon}/>
                </div>
                <div className={styles.options}>
                    <span>Sort</span>
                    <Dropdown list={['Ascending', 'Descending']} selected={orderBy} setSelected={setOrderBy} />
                    {/* <Dropdown list={['Name', 'Created At', 'Last Updated']} selected={selectBy} setSelected={setSelectBy} /> */}
                    <Dropdown list={['Created At', 'Last Updated']} selected={selectBy} setSelected={setSelectBy} />
                </div>
                <div className={styles.cardContainer}>
                    {problems.length == 0? 
                        <div className={styles.none}>No Problems Here!</div> : 
                        problemElements
                    }
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                        <span>{user?.name[0]}</span>
                    </div>
                    <div className={styles.details}>
                        <div className={styles.name}>Name: {user?.name}</div>
                        <div className={styles.email}>{user?.email}</div>
                    </div>
                </div>

                <div className={styles.problemInfo}>
                    <span className={styles.difficulty} data-mode="Easy">
                        Easy: {count.Easy}
                    </span>
                    <span className={styles.difficulty} data-mode="Medium">
                        Medium: {count.Medium}
                    </span>
                    <span className={styles.difficulty} data-mode="Hard">
                        Hard: {count.Hard}
                    </span>
                    <span className={styles.difficulty} data-mode="Total">
                        Total: {count.Easy + count.Medium + count.Hard}
                    </span>
                </div>
            </div>


            <div className={styles.addProblem} onClick={() => router.push('/user/addProblem')}>
                <IoAdd />
            </div>
            
            {error != '' && <Notice text={error} setText={setError}/>}
        </div>
        {/* <BlobElem /> */}
    </main>
    )
}
