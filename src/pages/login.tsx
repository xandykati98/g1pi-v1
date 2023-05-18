
import { Auth } from '@supabase/auth-ui-react'
import styles from './login.module.css'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const Login = () => {
    const supabaseClient = useSupabaseClient()
    return <>
      <main className={styles.mainLogin}>
        <Auth
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          providers={[]}
          socialLayout="horizontal"
          localization={{
            variables: {
              "sign_up": {
                "email_label": "Email",
                "password_label": "Senha",
                "email_input_placeholder": "Seu endereço de email",
                "password_input_placeholder": "Sua senha",
                "button_label": "Criar conta",
                "loading_button_label": "Criando ...",
                "social_provider_text": "Sign in with {{provider}}",
                "link_text": "Não possui uma conta? Clique aqui para criar uma",
                "confirmation_text": "Check your email for the confirmation link"
              },
              "sign_in": {
                "email_label": "Email",
                "password_label": "Senha",
                "email_input_placeholder": "Seu endereço de email",
                "password_input_placeholder": "Sua senha",
                "button_label": "Entrar em PsychLink",
                "loading_button_label": "Entrando ...",
                "social_provider_text": "Sign in with {{provider}}",
                "link_text": "Já Possui uma conta? Entre"
              },
              "forgotten_password": {
                "email_label": "Email address",
                "password_label": "Your Password",
                "email_input_placeholder": "Your email address",
                "button_label": "Send reset password instructions",
                "loading_button_label": "Sending reset instructions ...",
                "link_text": "Esqueceu sua senha?",
                "confirmation_text": "Check your email for the password reset link"
              },
              "update_password": {
                "password_label": "New password",
                "password_input_placeholder": "Your new password",
                "button_label": "Update password",
                "loading_button_label": "Updating password ...",
                "confirmation_text": "Your password has been updated"
              }
            }
          }}
        />
      </main>
    </>
}
export default Login