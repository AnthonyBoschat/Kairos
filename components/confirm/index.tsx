"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import s from "./styles.module.scss"
import withClass from "@/utils/class"

interface ConfirmationProps {
    children: React.ReactNode | ((open: boolean, isClosing: boolean) => React.ReactNode)
    onClick: Function
    content?: string | React.ReactNode
    icon?: React.ReactNode
    disabled?: boolean
    onClose?: Function
}

export default function Confirmation(props: ConfirmationProps) {
    const [open, setOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const triggerRef = useRef<HTMLDivElement>(null)
    const popupRef = useRef<HTMLDivElement>(null)

    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            setPosition({
                top: rect.top + window.scrollY,
                left: rect.left + rect.width / 2 + window.scrollX
            })
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        if (props.disabled) {
            return props.onClick()
        }
        event.preventDefault()
        updatePosition()
        setOpen(true)
    }

    const handleClose = (event?: React.MouseEvent) => {
        event?.stopPropagation()
        setIsClosing(true)
        props.onClose?.()
        setTimeout(() => {
            setOpen(false)
            setIsClosing(false)
        }, 150)
    }

    const handleConfirm = (event: React.MouseEvent) => {
        event.stopPropagation()
        handleClose()
        props.onClick()
    }

    useEffect(() => {
        if (!open) return

        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                handleClose()
            }
        }

        const handleScroll = () => updatePosition()

        document.addEventListener("mousedown", handleClickOutside)
        window.addEventListener("scroll", handleScroll, true)
        window.addEventListener("resize", updatePosition)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("scroll", handleScroll, true)
            window.removeEventListener("resize", updatePosition)
        }
    }, [open])

    return (
        <div ref={triggerRef} className={s.container}>
            <div className={s.children_container} onClick={handleClick}>
                {typeof props.children === "function" ? props.children(open, isClosing) : props.children}
            </div>

            {open && createPortal(
                <div
                    ref={popupRef}
                    className={withClass(s.confirm_container, s.portal, isClosing && s.closing)}
                    style={{
                        position: 'absolute',
                        top: position.top,
                        left: position.left,
                        transform: 'translate(-50%, -100%) translateY(-0.5rem)'
                    }}
                >
                    <div className={s.content}>
                        {props.content || "Êtes vous sûres ?"}
                    </div>
                    <div className={s.footer}>
                        <div className={s.icon}>
                            {props.icon}
                        </div>
                        <div>
                            <button onClick={handleClose} className={s.cancel}>Annuler</button>
                            <button onClick={handleConfirm} className={s.confirm}>Confirmer</button>
                        </div>
                    </div>
                    <div className={s.arrow}></div>
                </div>,
                document.body
            )}
        </div>
    )
}