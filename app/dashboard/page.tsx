import s from "./styles.module.scss"
import SideBar from "./_components/sideBar";
import Content from "./_components/content";

const folders = [
    {name:"Maurane", color: "#0025AB"},
    {name:"Cefim", color: "#CF4F00"},
    {name:"Randonnée", color: "#06AB00"},
    {name:"Liste de course", color: "#AE05B6"},
]


export default function Dashboard(){



    return(
        <div className={s.page}>

            <SideBar folders={folders}/>
            <Content/>
        </div>
    )
}