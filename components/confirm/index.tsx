"use client"

import { useEffect, useRef, useState } from "react"
import s from "./styles.module.scss"
import withClass from "@/utils/class"

interface ConfirmationProps{
    children: React.ReactNode | ((open: boolean, isClosing:boolean) => React.ReactNode)
    onClick: Function,
    content?: string|React.ReactNode,
    icon?:React.ReactNode,
    disabled?:boolean,
    onClose?: Function
}

export default function Confirmation(props: ConfirmationProps){

    const [open, setOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if(props.disabled){
            return props.onClick()
        }
        event.preventDefault()
        setOpen(true)
    }
    
    const handleClose = () => {
        setIsClosing(true)
        if(props.onClose){
            props.onClose()
        }
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
                {typeof props.children === "function" ? props.children(open,isClosing) : props.children}
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