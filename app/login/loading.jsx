import React from 'react'

const loading = () => {
    console.log('loading');

    return (
        <div>
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
                h
            </div>

        </div>
    )
}

export default loading
