import './styles.css'

export default function Loader() {
    return(
        <div className='w-full h-dvh flex-col place-content-center justify-items-center'>
            <div
            className='w-20 h-20 border-6 border-t-background border-foreground rounded-full animate-spin'
            ></div>
            <p className='mt-2'>Carregando...</p>
        </div>
    )
}