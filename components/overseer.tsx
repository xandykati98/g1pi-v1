import { useUser, User } from '@supabase/auth-helpers-react'
import { api } from '~/utils/api'
import AuthContext from './auth_context'
import Login from '~/pages/login'
import ThemeContext, { initialTheme } from './theme_context'

const Overseer = (props: {
    children: React.ReactNode
}) => {
    const user = useUser() as User
    const { data, isLoading } = api.user.getUserData.useQuery({ id: user?.id || '' })
    if (!user) {
        return <Login/>
    }
    if (isLoading) {
        return <div>loading</div>
    }
    
    if (user && !data?.isFuncionario) {
        return <div>você não é um funcionario</div>
    }
    return <>
        <ThemeContext.Provider value={initialTheme}>
            <AuthContext.Provider value={{ ...user, ...data }}>
                {props.children}
            </AuthContext.Provider>
        </ThemeContext.Provider>
    </>
}

export default Overseer;
