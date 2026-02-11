import { DashboardProvider } from "@/context/DashboardContext"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import SideBar from "./_components/sideBar"
import s from "./styles.module.scss"
import { Metadata } from "next"
import Search from "./_components/Search"
import { withTrash } from "@/utils/trash"

export const metadata: Metadata = {
  title: 'Kairos - Dashboard',
  description: 'Tableau de bord Kairos : gérez vos dossiers, listes et tâches rapidement',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  const user = await getCurrentUser()

  return (
    <DashboardProvider user={user}>
      <div className={s.page}>
        <SideBar />
        <div className={s.contentContainer}>
            <Search/>
            {children}  
        </div>
      </div>
    </DashboardProvider>
  )
}