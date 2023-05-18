import { useRouter } from 'next/router'
import { CSSProperties } from 'react';

function ActiveLink({ children, href, activeStyle, className }: { className?: string, children: React.ReactNode; href: string, activeStyle?: CSSProperties }) {
    const router = useRouter()
    const style = {
        ...(router.asPath === href ? activeStyle : {})
    }

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        void router.push(href).catch((error) => {
          // Handle any errors that occur during navigation
          console.error('Navigation error:', error)
        })
    }

    return (
        <a href={href} onClick={handleClick} style={style} className={className}>
            {children}
        </a>
    )
}

export default ActiveLink