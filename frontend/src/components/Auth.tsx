import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { InputBox } from './InputBox'
import { SignupSchema } from '@ifti_taha/common'
import axios from 'axios'
import { BACKEND_URL } from '../config'

const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const [postInputs, setPostInputs] = useState<SignupSchema>({
        name: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const sendRequest = async (): Promise<void> => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === 'signup' ? 'signup' : 'signin'}`, postInputs)
            const jwt = response.data;
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch (error) {
            alert("error while logging in")
        }
    }

    return (
        <div className='h-screen flex justify-center flex-col'>
            <div className='flex justify-center '>
                <div>
                    <div className='px-10'>
                        <div className='text-3xl font-extrabold'>
                            Create an account
                        </div>
                        <div className='text-slate-500'>
                            {type === "signin" ? "Don't have an account?" : "Already Have an account?"}
                            <Link className='pl-2 underline' to={type === "signin" ? "/signup" : "/signin"}>
                                {type === "signin" ? "Sign up" : "Sign in"}
                            </Link>
                        </div>
                    </div>
                    <div className='pt-18'>
                        {type === "signup" ? <InputBox label="Name" placeholder='Taha Iftikhar...' onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                name: e.target.value
                            })
                        }} /> : null}
                        <InputBox label="Username" placeholder='TahaIftikhar@gmail.com' onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                email: e.target.value
                            })
                        }} />
                        <InputBox label="Password" placeholder='abc#2fe' type={'password'} onChange={(e) => {
                            setPostInputs({
                                ...postInputs,
                                password: e.target.value
                            })
                        }} />
                        <button onClick={sendRequest} type="button" className="w-full m-7 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Auth }