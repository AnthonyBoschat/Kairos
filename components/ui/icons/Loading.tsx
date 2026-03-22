export default function LoadingIcon({ size = 24, duration = 1.5 }) {
    const d = `${duration}s`
    const b1 = duration / 3
    const b2 = (duration / 3) * 2

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <circle cx={18} cy={12} r={0} fill="currentColor">
                <animate attributeName="r" begin={b2} calcMode="spline" dur={d} keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate>
            </circle>
            <circle cx={12} cy={12} r={0} fill="currentColor">
                <animate attributeName="r" begin={b1} calcMode="spline" dur={d} keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate>
            </circle>
            <circle cx={6} cy={12} r={0} fill="currentColor">
                <animate attributeName="r" begin={0} calcMode="spline" dur={d} keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"></animate>
            </circle>
        </svg>
    )
}