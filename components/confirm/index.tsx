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
    const [arrowPosition, setArrowPosition] = useState({top:0, left:0})
    const [overflow, setOverflow] = useState(false)
    const triggerRef = useRef<HTMLDivElement>(null)
    const popupRef = useRef<HTMLDivElement>(null)

    const updatePosition = () => {
        if (!triggerRef.current) return
        
        const rect = triggerRef.current.getBoundingClientRect()
        const popupWidth = 410  // largeur estimée de la popup
        const margin = 16       // marge minimale par rapport aux bords
        
        // Position de base : centré au-dessus du trigger
        let left = rect.left + rect.width / 2 + window.scrollX
        const top = rect.top + window.scrollY
        
        // Calcul du décalage si la popup déborde
        const halfPopup     = popupWidth / 2
        const rightOverflow = left + halfPopup - window.innerWidth + margin
        
        let arrowOffset = 0
        
        if (rightOverflow > 0) {
            // Déborde à droite
            left -= rightOverflow
            arrowOffset = rightOverflow
            setOverflow(true)
        } 
        
        setPosition({ top, left })
        setArrowPosition({ top: 0, left: 50 + (arrowOffset / popupWidth) * 100 }) // en pourcentage
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
                    <div
                        style={{ left: `${arrowPosition.left}%`, transform:`translateX(${overflow ? "-25%" : "-50%"})` }}
                        className={s.arrow}>
                        
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}