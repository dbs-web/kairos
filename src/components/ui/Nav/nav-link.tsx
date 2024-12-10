import { ReactNode } from "react"

interface NavLinkProps {
    Icon: ReactNode
    text: string,
    href: string,
    active?: boolean,
}

export default function NavLink({Icon, text, href, active=false} : NavLinkProps){
    return (
        <li className={`${active ? 'bg-white text-primary shadow-md border' : ''} font-bold text-neutral-500 flex items-center justify-center gap-x-2 p-2 rounded-lg hover:bg-neutral-100 transition-all duration-300`}>
            {Icon}
            <a href={href}>{text}</a>
        </li>
    )   
}