import { toast } from "react-toastify"

interface handleResponseProps{
    request: Function,
    onSuccess?: Function,
    onError?: Function
}

export default async function handleResponse({request, onSuccess, onError}:handleResponseProps){
    const response = await request()
    if(!response.success){
        if(response.message){
            toast.error(response.message)
        }else{
            toast.error("Un problème est survenu, veuillez réessayer")
        }
        if(onError){
            onError(response)
        }
    }
    if(response.success){
        if(response.message){
            toast.success(response.message)
        }
        if(onSuccess){
            onSuccess(response)
        }
    }
}