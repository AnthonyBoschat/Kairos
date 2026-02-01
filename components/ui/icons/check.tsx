
interface CheckIconProps {
    size?: number
    hidden?: boolean
    active?: boolean
    checkScale?: number
    fill?: string
    inactiveIcon?: "circle" | "check"
}


export default function CheckIcon({ 
    size = 24, 
    hidden = false, 
    active = false, 
    checkScale = 0.8, 
    fill="white", 
    inactiveIcon="circle" 
}: CheckIconProps) {
    const style: React.CSSProperties = {
        ...(hidden && { visibility: 'hidden' }),
        color: 'rgb(0,0,0,0.6)',
        cursor: 'pointer',
    }

    if (active) {
        return (
            <svg style={style} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
                <circle cx={12} cy={12} r={10} fill="#1971B8"/>
                <path 
                    fill="white" 
                    d="M10 15.17l-3.17-3.17-1.41 1.41L10 18l8-8-1.41-1.41z"
                    transform={`translate(12, 12) scale(${checkScale}) translate(-12, -12)`}
                />
            </svg>
        )
    }

    if(inactiveIcon === "check"){
        return(
            <svg style={style} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
                <circle cx={12} cy={12} r={10} fill="rgba(0, 0, 0, 0.3)"/>
                <path 
                    fill="white" 
                    d="M10 15.17l-3.17-3.17-1.41 1.41L10 18l8-8-1.41-1.41z"
                    transform={`translate(12, 12) scale(${checkScale}) translate(-12, -12)`}
                />
            </svg>
        )
    }
    if(inactiveIcon === "circle"){
        return (
            <svg 
                style={style} 
                xmlns="http://www.w3.org/2000/svg" 
                width={size} 
                height={size} 
                viewBox="0 0 24 24"
                onMouseEnter={(e) => e.currentTarget.style.color = '#7d7d7d'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#969696'}
            >
                <circle cx={12} cy={12} r={9} fill={fill} stroke="currentColor" strokeWidth={1}/>
            </svg>
        )
    }
    
}