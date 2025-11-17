"use client"

import { RefObject, useEffect, useRef, useState } from "react"
import s from "./styles.module.scss"
import withClass from "@/utils/class"
import WarningIcon from "../ui/icons/Warning"

interface ConfirmationProps{
    children:React.ReactNode,
    onClick: Function,
    content?: string|React.ReactNode,
    icon?:React.ReactNode
}

export default function Confirmation(props: ConfirmationProps){

    const [open, setOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        setOpen(true)
    }
    
    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            setOpen(false)
            setIsClosing(false)
        }, 150)
    }

    const handleConfirm = () => {
        handleClose()
        props.onClick()
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(containerRef.current && !containerRef.current.contains(event.target as Node)){
                handleClose()
            }
        }
        if(open){
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [open])

    
    return(
        
        <div ref={containerRef} className={s.container}>
            <div className={s.children_container} onClick={handleClick}>
                {props.children}
            </div>
            {open && (
                <div className={withClass(s.confirm_container, isClosing && s.closing)}>
                    <div className={s.content}>
                        {props.content || "Êtes vous sûres ?"}
                    </div>
                    <div className={s.footer}>
                        <div className={s.icon}>
                            {props.icon && props.icon}
                        </div>
                        <div>
                            <button onClick={handleClose} className={s.cancel}>Annuler</button>
                            <button onClick={handleConfirm} className={s.confirm}>Confirmer</button>
                        </div>
                    </div>
                    <div className={s.arrow}></div>
                </div>
            )}

        </div>
    )
}