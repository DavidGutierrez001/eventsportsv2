import Link from "next/link";

export default function Hero() {
    return (
        <div className="h-svh w-full overflow-hidden flex flex-col items-center justify-end relative">

            <div
                className="pointer-events-none z-10 absolute inset-0 opacity-15 bg-cover"
                style={{
                    backgroundImage:
                        'url("https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png")',
                    backgroundSize: "150px",
                }}
            />

            <video
                src="/videos/hero.mp4"
                className="h-full w-full object-cover opacity-70"
                autoPlay
                muted
                loop
                playsInline
            />

            <div className="absolute flex max-w-470 w-full h-[calc(100%-5rem)] justify-center md:justify-between px-[clamp(1rem,10vw,10rem)] flex-col md:flex-row gap-10 items-start md:items-center">
                <div className="font-bebas font-bold leading-none max-w-90 min-w-90 md:min-w-fit md:max-w-fit pe-10">
                    <h1 className="text-[clamp(4rem,6vw,8rem)]">
                        DONDE EL <br />
                        <span className="text-[clamp(5rem,7vw,9rem)]">DEPORTE</span><br />
                        COBRA VIDA.
                    </h1>
                </div>

                <div className="font-light text-white max-w-100 flex flex-col justify-center items-start overflow-hidden">
                    <p className="text-xl md:text-[2xl]">Descubre, explora, gestiona y participa en eventos deportivos en tu zona. Encuentra actividades de diferentes disciplinas y divisiones.
                    </p>
                    <Link href="/register" className="flex w-full items-center btn-selected p-4 md:p-5 text-lg text-black font-medium justify-center backdrop-blur-sm bg-white/90 hover:bg-white rounded shadow-md mt-10 transition-colors">
                        COMIENZA AHORA
                    </Link>
                </div>
            </div>


        </div>
    )
}