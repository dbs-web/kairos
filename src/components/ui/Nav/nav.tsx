"use client"
import { usePathname } from 'next/navigation';
import Image from "next/image"
import NavLink from "./nav-link"
import { AiOutlineBulb } from "react-icons/ai";
import { PiNewspaper } from "react-icons/pi";
import { CiVideoOn, CiCircleList } from "react-icons/ci";

import NavUserMenu from "./nav-user-menu";


export default function Nav(){
    const path = usePathname()
    console.log(path)
    return (
        <nav className="flex items-center justify-between w-screen h-20 border-b px-12">
            <Image src={"/kairos-logo-title.webp"} width={160} height={40} alt="Kairós logo"/>

            <ul className="flex items-center justify-center gap-x-4">
                <NavLink Icon={<AiOutlineBulb className="text-xl mb-1"/>} text="Sugestões" href="/sugestoes" active={path === '/sugestoes'}/>
                <NavLink Icon={<PiNewspaper className="text-xl mb-1"/>} text="Notícias" href="/noticias" active={path === '/noticias'}/>
                <NavLink Icon={<CiVideoOn className="text-xl mb-1"/>} text="Video Maker" href="/video-maker" active={path === '/video-maker'}/>
                <NavLink Icon={<CiCircleList className="text-xl mb-1"/>} text="Briefings" href="/briefings" active={path === '/briefings'}/>
            </ul>


            <NavUserMenu image="/kairos-logo-simple.png" name="KA"/>
        </nav>
    )
}