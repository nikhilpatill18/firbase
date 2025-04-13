"use client"
import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setuser } from '@/store/authslice'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'



// created the protected route for the  validation of the user as used for multiple components
const Protectedroute = ({ children }) => {
    const router = useRouter();
    // const [loading, setloading] = useState(true)

    const [user, loading] = useAuthState(auth)
    console.log("user", user);
    console.log("user", loading);




    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
        else {
            console.log("protected trouted  dispatching the user");
            router.push('/')
        }
        // const unsubscribed = onAuthStateChanged(auth, (user) => {
        //     if (user) {
        //         setloading(false)
        //         router.push('/')
        //     }
        //     else {
        //         router.push('/are')
        //     }

        // })
        // return () => unsubscribed()

    }, [])

    if (loading) return <div>
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>

        </div>
    </div>
    return (
        <div>
            {children}
        </div>
    )
}

export default Protectedroute
