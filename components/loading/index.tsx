// Loading.tsx
"use client"
import s from "./styles.module.scss"

interface LoadingProps{
    size?: number
}

export default function Loading({size=40}: LoadingProps){
    return(
        <div style={{width: size, height:size}} className={s.spinner}></div>
    )
}