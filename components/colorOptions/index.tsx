"use client"
import withClass from "@/utils/class"
import CarretDownIcon from "../ui/icons/CarretDown"
import s from "./styles.module.scss"

interface DefaultProps{
    colorCollection : string[]
    onClick: Function
    currentColor: string
    columns:number
}


export default function ColorOptions(props:DefaultProps){


    return(    
        <div className={s.colorOptions}>
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