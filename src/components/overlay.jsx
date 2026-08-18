"use client";

import { useEffect, useState } from "react";

export default function Overlay() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const handleLoad = () => setIsLoaded(true);

        if (document.readyState === "complete") {
            handleLoad();
            return;
        }

        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
    }, []);

    return (
        <div
            className={`fixed inset-0 z-200 flex h-screen w-screen flex-col items-center justify-center gap-5 bg-black pointer-events-none transition-all duration-500 ease-in-out delay-500 ${isLoaded ? "loaded-overlay" : ""
                }`}
        >
            <img
                className="h-12"
                src="/eventsports.svg"
                alt="Eventsports Logo"
            />
            <span className="loader" />
        </div>
    );
}