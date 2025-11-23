import { List } from "@prisma/client"
import s from "./styles.module.scss"
import LIST_COLOR from "@/constants/listColor"
import StarIcon from "@/components/ui/icons/Star"
import OptionsIcon from "@/components/ui/icons/Options"
import Divider from "@/components/divider"

interface ListItemProps{
    list: List
}


export default function ListItem(props:ListItemProps){

    return(
        <li className={s.container}>
            <div style={{backgroundColor: props.list.customColor || LIST_COLOR[props.list.defaultColor ?? 0]}} className={s.color}/>
            <div className={s.header}>
                <div className={s.left}>
                    <span className={s.title}>{props.list.title}</span>
                    <span className={s.tasksCount}>3</span>
                </div>
                <div className={s.right}>
                    <StarIcon animate active={props.list.favorite} size={18}/>
                    <OptionsIcon size={20}/>
                </div>
            </div>

            <div className={s.listContent}>
                <button className={s.addElement}>Ajouter un élément</button>
                <Divider width="15%" style={{marginTop:"0.75rem"}}/>
            </div>

        </li>
    )
}