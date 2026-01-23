"use client"
import withClass from "@/utils/class"
import s from "./styles.module.scss"
import { Dispatch, SetStateAction, useRef } from "react"
import useCallbackOnClickOutside from "@/hooks/useCallbackOnClickOutside"

interface DefaultProps{
    colorCollection : string[]
    onClick: Function
    currentColor: string
    columns:number
    setOpen: Dispatch<SetStateAction<Boolean>>
}


export default function ColorOptions(props:DefaultProps){

    const optionsContainerRef = useRef(null)

    useCallbackOnClickOutside(optionsContainerRef, () => props.setOpen(false))
    return(    
        <div ref={optionsContainerRef} className={s.colorOptions}>
            <ul style={{gridTemplateColumns:`repeat(${props.columns}, 1fr)`}}>
                {props.colorCollection.map((color, index) => (
                    <li key={index}>
                        <button
                            title={`Changer la couleur du dossier pour ${color}`} 
                            className={withClass(props.currentColor === props.colorCollection[index] && s.active)} 
                            style={{backgroundColor:color}}
                            onClick={() => props.onClick(index)}
                        />
                    </li>
                ))}
                
            </ul>
        </div>
    )
}