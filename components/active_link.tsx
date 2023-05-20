import { useRouter } from 'next/router'
import { CSSProperties } from 'react';

function ActiveLink({ children, href, activeStyle, className, activeClassName }: { 
    className?: string, 
    children: React.ReactNode,
    href: string, 
    activeStyle?: CSSProperties,
    activeClassName?: string 
}) {
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
    const classNames = router.asPath === href ? `${className||''} ${activeClassName||''}` : className
    return (
        <a href={href} onClick={handleClick} style={style} className={classNames}>
            {children}
        </a>
    )
}

export default ActiveLink