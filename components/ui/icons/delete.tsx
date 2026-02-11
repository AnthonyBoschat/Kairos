export default function DeleteIcon({ size = 24, disabled=false }) {

    if(disabled){
        return(
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m3 3l18 18M4 7h3m4 0h9m-10 4v6m4-3v3M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l.077-.923m.307-3.704L19 7M9 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"></path></svg>
        )
    }
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"></path></svg>
    )

}