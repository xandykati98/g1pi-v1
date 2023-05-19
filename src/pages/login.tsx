
import styles from './login.module.css'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { MouseEventHandler, useEffect, useRef, useState } from 'react'
import { api } from "~/utils/api";

enum AuthView {
  LOGIN = 'sign_in',
  SIGNUP = 'sign_up',
  FORGOT_PASSWORD = 'forgot_password',
}

const Login = () => {

  const createUser = api.user.createUser.useMutation()

  const [view, setView] = useState<AuthView>(AuthView.LOGIN)

  const view_to_title = {
    sign_in: 'Entre na sua conta',
    sign_up: 'Cadastre-se',
    forgot_password: 'Recuperar senha',

  }
  return <>
    <main className={styles.mainLogin}>
      
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {view_to_title[view]}
          </h2>
        </div>
        {
          view === AuthView.LOGIN && <LoginView setView={setView}/>
        }
        {
          view === AuthView.FORGOT_PASSWORD && <PasswordView setView={setView}/>
        }
        {
          view === AuthView.SIGNUP && <SignupView createUser={createUser} setView={setView}/>
        }
      </div>
    </main>
  </>
}
type FormField = { value: string }
export function PasswordView({setView}: {setView: (view: AuthView) => void}) {
  
  const supabaseClient = useSupabaseClient()
  const formRef = useRef<HTMLFormElement>(null)
  const resetPass:MouseEventHandler<HTMLButtonElement> | Promise<void> = (e) => {
    e.preventDefault()
    try {
      const form = formRef.current
      if (form) {

        supabaseClient.auth.resetPasswordForEmail((form.email as FormField).value)
          .then(({ data, error }) => {
            if (error) {
              alert(error.message)
            } else {
              alert('Email enviado')
            }
          })
          .catch(console.log)
      }
    } catch (error) {
      alert(error)
    }
    return
  }
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" action="#" method="POST" ref={formRef}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Email
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={resetPass}
          >
            Enviar
          </button>
        </div>
      </form>
      
      <p className="mt-10 text-center text-sm text-gray-500">
        
        <a href="#" onClick={() => setView(AuthView.LOGIN)} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          Voltar para o login
        </a>
      </p>
    </div>
  )
}

export function SignupView({setView, createUser}: {setView: (view: AuthView) => void, createUser: ReturnType<typeof api.user.createUser.useMutation>}) {

  const supabaseClient = useSupabaseClient()
  const formRef = useRef<HTMLFormElement>(null)
  const createAccount:MouseEventHandler<HTMLButtonElement> | Promise<void> = (e) => {
    e.preventDefault()
    const form = formRef.current
    if (form) {
      createUser.mutate({
        email: (form.email as FormField).value, 
        password: (form.password as FormField).value,
        nome: (form.nome as FormField).value
      })
    } else {
      alert('Preencha o formulário.')
    }
    return
  }
  useEffect(() => {
    if (createUser.isSuccess) {
      alert('Usuário criado com sucesso!')
      supabaseClient.auth.signInWithPassword({
        email: createUser.data?.email || '',
        password: createUser.data?.password || ''
      }).then((res) => {
        console.log({res})
      }).catch((err) => {
        alert(err)
      })
    }
  }, [createUser.isSuccess])
  useEffect(() => {
    if (createUser.isError) {
      alert(createUser.error?.message)
    }
  }, [createUser.isError])
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" action="#" method="POST" ref={formRef}>
      <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Nome
          </label>
          <div className="mt-2">
            <input
              id="nome"
              name="nome"
              type="text"
              autoComplete="name"
              required
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Email
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Senha
            </label>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            disabled={createUser.isLoading}
            type="submit"
            onClick={createAccount}
            className={`
            ${createUser.isLoading ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''} 
            flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`} 
          >
            Criar conta
          </button>
        </div>
      </form>
      <p className="mt-10 text-center text-sm text-gray-500">
        <a href="#" onClick={() => setView(AuthView.LOGIN)} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          Voltar para o login
        </a>
      </p>
    </div>
  )
}

export function LoginView({setView}: {setView: (view: AuthView) => void}) {
  const supabaseClient = useSupabaseClient()
  const formRef = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState(false)
  const signIn:MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    setLoading(true)
    const form = formRef.current
    if (form) {
      try {
        supabaseClient.auth.signInWithPassword({
          email: (form.email as FormField).value,
          password: (form.password as FormField).value
        }).then(({ error }) => {
          if (error) {
            alert(error.message)
          }
        }).finally(() => {    
          setLoading(false)
        }).catch(console.log)
      } catch (error) {
        alert(error)
      }
    } else {
      alert('Preencha o formulário.')
    }
    return
  }
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" action="#" method="POST" ref={formRef}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Email
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Senha
            </label>
            <div className="text-sm">
              <a href="#" onClick={() => setView(AuthView.FORGOT_PASSWORD)} className="font-semibold text-indigo-600 hover:text-indigo-500">
                Esqueceu sua senha?
              </a>
            </div>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
          onClick={signIn}
            type="submit"
            className={`
            ${loading ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''}
            flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`} 
          >
            Entrar
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm text-gray-500">
        Não possui cadastro?{' '}
        <a href="#" onClick={() => setView(AuthView.SIGNUP)} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          Clique aqui para se cadastrar
        </a>
      </p>
    </div>
  )
}

export default Login