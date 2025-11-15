import s from "./styles.module.scss"
import SideBar from "./_components/sideBar";
import Content from "./_components/content";
import { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: 'Kairos - Dashboard',
  description: 'Tableau de bord Kairos : gérez vos dossiers, listes et tâches rapidement',
}


export default async function Dashboard(){

    const user = await getCurrentUser()
    const folders = await prisma.folder.findMany({
        where:{
            userId: user?.id
        }
    })
    const sortedFolders = folders.sort((a, b) => a.order - b.order)

    return(
        <div className={s.page}>

            <SideBar folders={sortedFolders}/>
            <Content/>
        </div>
    )
}