"use client"
import s from "./styles.module.scss"

interface BrandProps{
    scale?: number
}


export default function Brand({scale}:BrandProps){


    return(
        <div className={s.container}>
            <img 
                className={s.logo}
                src="/icons/kairos_brand.svg" 
                alt="Logo de l'application Kairos" 
                style={{
                    transform:`scale(${scale ? scale : '1'})`,
                }} 
            />
        </div>
    )
}