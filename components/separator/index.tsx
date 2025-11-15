"use client"
import { CSSProperties } from "react"
import s from "./styles.module.scss"

interface DividerProps{
    width?:number
    style?: CSSProperties
}


export default function Divider(props: DividerProps) {
    return (
        <div 
            style={{
                width: props.width || "100%",
                ...props.style
            }}
            className={s.container}
        />
    )
}