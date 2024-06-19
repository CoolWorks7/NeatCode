'use client'

import Image from "next/image";
import styles from "./page.module.css";
import Header from "./_components/header";
import Footer from "./_components/footer";
import { Editor } from "@monaco-editor/react";
import { IoLogoJavascript } from "react-icons/io";
import { FaCaretDown } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { TbBrandCpp } from "react-icons/tb";
import { FaJava } from "react-icons/fa";
import { IoLogoPython } from "react-icons/io5";
import { IoLogoJavascript as IoLogoJavascriptNew} from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getAuth } from "@/redux/features/authSlice";


export function BlobElem() {
  return <>
    <div className={styles.blob}></div>
  </>
}

export default function Home() {
  const sampleCode = `
\nvar deleteDuplicates = function(head) {
      let l = head
      while(l) {
            if (l.next && l.val == l.next.val) {
                  l.next = l.next.next
            } 
            else l = l.next
      }
      return head
};
  `
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(getAuth())
  }, [])
  
  return (
    <main className={styles.main}>
      <Header active='home'/>
      <div className={styles.homeContainer}>
        <div className={styles.left}>
          <div className={styles.top}>
            <div className={styles.mainTitle}>Organize and Retrieve Your {'<'}Codes! /{'>'}</div>
            <div className={styles.subTitle}>Secure and organized Data Structures and Algorithms solutions. Save, manage, and quickly retrieve your DSA codes.</div>
          </div>
          <button onClick={() => router.push('/user/register')} className={styles.button}>Register!</button>
        </div>

        <div className={styles.right}>
          <div className={styles.editorName}>
            <IoLogoJavascript />
            <span>Javascript </span>
            <FaCaretDown style={{color: '#112'}}/>
          </div>
          
          <div style={{flex: 1, height: '70dvh', position: 'relative'}}>
            <Editor
              width="100%"
              theme="vs-dark"
              defaultLanguage="javascript" 
              defaultValue="// code" 
              value={sampleCode}
              options={{fontFamily: 'Fira Code, Consolas, "Courier New", monospace', fontWeight: 500, padding: '10px', tabSize: 6}}
            />
            <div style={{position: 'absolute', top: 0, left: 0, height: '100%', width: '100%'}}></div>
            
          </div>

          <div className={styles.placedIconsParent}>
            <IoLogoJavascriptNew className={styles.placedIcons}/>
            <IoLogoPython className={styles.placedIcons}/>
            <FaJava className={styles.placedIcons}/>
            <TbBrandCpp className={styles.placedIcons}/>
          </div>
        </div>

        <BlobElem />
      </div>

    </main>
  );
}
