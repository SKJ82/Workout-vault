import {useState} from 'react'
import {useAuthContext} from './useAuthContext'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setisLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setisLoading(true)
        setError(null)

        const response = await fetch('/api/user/login', {
            method : 'POST', 
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({email, password})
        })

        const json = await response.json()

        if (!response.ok){
            setisLoading(false)
            setError(json.error)
        }

        else{
            //save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            //update the auth context
            dispatch({type : 'LOGIN', payload : json})

            setisLoading(false)
        }
    }

    return { login, isLoading, error }
}