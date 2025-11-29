"use client"
import withClass from "@/utils/class"
import s from "./styles.module.scss"
import { useState } from "react"

interface OverlayProps{
    onClose?:Function
    children: React.ReactNode | ((isClosing: boolean) => React.ReactNode)
}


export default function Overlay(props:OverlayProps){

    const [isClosing, setIsClosing] = useState<boolean>(false)
    

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            if(props.onClose){
                props.onClose()
            }
        }, 85)
    }

    return(
        <>    
            <div 
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        handleClose()
                    }
                }} 
                className={withClass(s.container, isClosing && s.closing)}
            />
            {typeof props.children === "function" ? props.children(isClosing) : props.children}
        </>
    )
}