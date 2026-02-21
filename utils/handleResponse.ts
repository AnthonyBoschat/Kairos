import { toast } from "react-toastify"

export default async function handleResponse(successCallback: Function, errorCallback?: Function){
    try{
        await successCallback()
    }catch(error){
        console.error(error)
        if(error instanceof Error){
            toast.error(error.message)
            if(errorCallback){
                errorCallback()
            }
        }
    }
}