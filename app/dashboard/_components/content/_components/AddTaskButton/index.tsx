"use client"
import Divider from "@/components/divider"
import s from "./styles.module.scss"
import { Dispatch, SetStateAction } from "react"

interface AddTaskButtonProps{
    setIsAddingTask: Dispatch<SetStateAction<boolean>>
}


export default function AddTaskButton(props:AddTaskButtonProps){

    const handleClick = () => {
        props.setIsAddingTask(true)
    }

    return(
        <div className={s.container}>
            <button onClick={handleClick} className={s.button}>Ajouter un élément</button>
            <Divider width="15%" style={{marginTop:"0.75rem"}}/>
        </div>
    )
}