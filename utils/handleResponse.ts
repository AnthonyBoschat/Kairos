import { toast } from "react-toastify"

export default async function handleResponse(callback: Function){
    try{
        await callback()
    }catch(error){
        console.log(error)
        if(error instanceof Error){
            toast.error(error.message)
        }
    }
}