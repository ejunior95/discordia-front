import { ChatBody } from "@/custom-components/ChatBody"
import { Navbar } from "@/custom-components/Navbar"

export default function Chat () {
    return(
        <>
            <Navbar />
            <section className='w-full h-dvh flex-col place-content-center justify-items-center'>
                <ChatBody />
            </section>
        </>
    )
}