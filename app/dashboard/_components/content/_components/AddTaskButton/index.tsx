"use client"
import Divider from "@/components/divider"
import s from "./styles.module.scss"

interface AddTaskButtonProps{

}


export default function AddTaskButton(props:AddTaskButtonProps){


    return(
        <div className={s.container}>
            <button className={s.button}>Ajouter un élément</button>
            <Divider width="15%" style={{marginTop:"0.75rem"}}/>
        </div>
    )
}