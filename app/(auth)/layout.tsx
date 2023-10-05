import { ClerkProvider } from "@clerk/nextjs"
import {Inter} from "next/font/google";
import "../globals.css";


export const metadata={
    ttitle:"DEVMedia",
    description:'A Next.js 13 Meta DEV application'
}
//font
const inter=Inter({subsets:['latin']})

export default function RootLayout({
    children
}:{
    children:React.ReactNode
}){
    return(
        <ClerkProvider>
            <html>
                <body className={`${inter.className} bg-dark-1`}>
                    <div className="w-full flex justify-center items-center min-h-screen">
                        {children}
                    </div>
                    
                </body>
            </html>
            
        </ClerkProvider>

    )
}