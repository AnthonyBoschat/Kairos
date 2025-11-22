import { useMemo } from "react";

export default function StarIcon({size = 24, active=false, animate=false }) {

    const duration = "0.2s"

    const style = useMemo(() => {
        if(active){
            return {
                fill:"rgba(245, 212, 0, 1)",
                stroke:"rgb(0,0,0,0.8)",
            }
        }else{
            return{
                fill:"rgb(0,0,0,0.1)",
                stroke:"rgb(0,0,0,0.8)"
            }
        }
    }, [active])

    if(animate){
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
                <path fill={style?.fill} fillOpacity={0} d="M12 3l2.35 5.76l6.21 0.46l-4.76 4.02l1.49 6.04l-5.29 -3.28l-5.29 3.28l1.49 -6.04l-4.76 -4.02l6.21 -0.46Z">
                    <animate fill="freeze" attributeName="fill-opacity" begin={duration} dur={duration} values="0;1"></animate>
                </path>
                <path fill="none" stroke={style?.stroke} strokeDasharray={36} strokeDashoffset={36} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3l-2.35 5.76l-6.21 0.46l4.76 4.02l-1.49 6.04l5.29 -3.28M12 3l2.35 5.76l6.21 0.46l-4.76 4.02l1.49 6.04l-5.29 -3.28">
                    <animate fill="freeze" attributeName="stroke-dashoffset" dur={duration} values="36;0"></animate>
                </path>
            </svg>
        );
    }

    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <path fill={style?.fill} fillOpacity={1} d="M12 3l2.35 5.76l6.21 0.46l-4.76 4.02l1.49 6.04l-5.29 -3.28l-5.29 3.28l1.49 -6.04l-4.76 -4.02l6.21 -0.46Z" />
            <path fill="none" stroke={style?.stroke} strokeDasharray={36} strokeDashoffset={0} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3l-2.35 5.76l-6.21 0.46l4.76 4.02l-1.49 6.04l5.29 -3.28M12 3l2.35 5.76l6.21 0.46l-4.76 4.02l1.49 6.04l-5.29 -3.28" />
        </svg>
    )
}