"use client"
import Divider from "@/components/divider"
import { signOut } from "next-auth/react"
import s from "./styles.module.scss"
import CarretDownIcon from "@/components/ui/icons/CarretDown"
import {  useState } from "react"
import withClass from "@/utils/class"
import LogoutIcon from "@/components/ui/icons/Logout"
import { userType } from "@/types/user"
import DeleteIcon from "@/components/ui/icons/delete"
import { useDashboardContext } from "@/context/DashboardContext"
import { TrashFilter } from "@/types/trashFilter"

type userMenuProps = {
    user: userType
}
export default function UserMenu(props: userMenuProps){

    const {trashFilter, setTrashFilter} = useDashboardContext()
    const [menuOpen, setMenuOpen]       = useState(false)

    const trashIndicator = trashFilter && (trashFilter === "yes" || trashFilter === "only")

    const isTrashSelected = (value:string) => {
        return value === trashFilter
    }
    
    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/?signedOut=true" })
    }

    const handleSelectTrashFilter = (value:TrashFilter) => {
        if(value !== trashFilter){
            setTrashFilter(value)
        }

    }
    
    return(
        <div className={withClass(s.container, menuOpen && s.open)}>


            <div className={withClass(s.indicator, menuOpen && s.hidden)}>
                {trashIndicator && (
                    <div 
                        title={
                            trashFilter === "yes" 
                                ? "Les éléments supprimés et non supprimés sont afficher" 
                                : trashFilter === "only" 
                                    ? "Seulement les éléments supprimés et leurs arborescences sont afficher" 
                                    : ""
                            } 
                        className={withClass(s.trash, s[trashFilter])}>
                        <DeleteIcon size={18}/>
                        {trashFilter === "only" && (
                            <svg className={s.warningIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path fill="rgb(240, 42, 42)" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
                                <path fill="white" d="M13 13V7h-2v6zm0 4v-2h-2v2z"/>
                            </svg>
                        )}

                    </div>
                )}
            </div>

            <button className={withClass(s.menuButton, menuOpen && s.active)} onClick={() => setMenuOpen(current => !current)} >
                {props.user.name} <CarretDownIcon size={16}/>
            </button>




            <div className={withClass(s.menu, menuOpen && s.active)}>

                <div className={s.indicator}>
                    {trashIndicator && (
                        <div 
                            title={
                                trashFilter === "yes" 
                                    ? "Les éléments supprimés et non supprimés sont afficher" 
                                    : trashFilter === "only" 
                                        ? "Seulement les éléments supprimés et leurs arborescences sont afficher" 
                                        : ""
                                } 
                            className={withClass(s.trash, s[trashFilter])}>
                            <DeleteIcon size={18}/>
                            {trashFilter === "only" && (
                                <svg className={s.warningIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fill="rgb(240, 42, 42)" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
                                    <path fill="white" d="M13 13V7h-2v6zm0 4v-2h-2v2z"/>
                                </svg>
                            )}

                        </div>
                    )}
                </div>
                
                <div className={withClass(s.action, s.trash)}>
                    <div className={s.trashIcons}>
                        <span title="Ne pas inclure les éléments supprimés dans l'affichage" onClick={() => handleSelectTrashFilter("no")} className={withClass(s.no, isTrashSelected("no") && s.active)}>
                            <DeleteIcon disabled size={18} />
                        </span>
                        <span title="Inclure les éléments supprimés dans l'affichage" onClick={() => handleSelectTrashFilter("yes")} className={withClass(s.yes, isTrashSelected("yes") && s.active)}>
                            <DeleteIcon size={18} />
                        </span>
                        <span title="N'inclure que les éléments supprimés dans l'affichage" onClick={() => handleSelectTrashFilter("only")} className={withClass(s.only, s.warning, isTrashSelected("only") && s.active)}>
                            <DeleteIcon size={18} />
                            <svg className={s.warningIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path fill="rgb(240, 42, 42)" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
                                <path fill="white" d="M13 13V7h-2v6zm0 4v-2h-2v2z"/>
                            </svg>
                        </span>
                    </div>
                </div>


                <button className={s.action} onClick={handleSignOut}>
                    <LogoutIcon size={18}/> Se déconnecter
                </button>


                <Divider style={{backgroundColor:"rgba(255, 255, 255, 0.38)"}}/>
            </div>
        </div>
    )
}