"use client"
import Divider from "@/components/divider"
import { signOut } from "next-auth/react"
import s from "./styles.module.scss"
import CarretDownIcon from "@/components/ui/icons/CarretDown"
import { useState } from "react"
import withClass from "@/utils/class"
import LogoutIcon from "@/components/ui/icons/Logout"
import { userType } from "@/types/user"

type userMenuProps = {
    user: userType
}
export default function UserMenu(props: userMenuProps){

    const [menuOpen, setMenuOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/?signedOut=true" })
    }
    
    return(
        <div className={withClass(s.container, menuOpen && s.open)}>
            <button className={withClass(s.menuButton, menuOpen && s.active)} onClick={() => setMenuOpen(current => !current)} >
                {props.user.name} <CarretDownIcon size={16}/>
            </button>
            <div className={withClass(s.menu, menuOpen && s.active)}>
                <button className={s.logout} onClick={handleSignOut}>
                    <LogoutIcon size={18}/> Se déconnecter
                </button>
                <Divider style={{backgroundColor:"rgba(255, 255, 255, 0.38)"}}/>
            </div>
        </div>
    )
}