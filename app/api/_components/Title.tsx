import ENV from "@/constants/env"
import s from "../../styles.module.scss"

export default function AppTitle(){
    
    return(
        <span className={s.title}>
          {ENV.APP_NAME}
        </span>
    )
}