import Layout from './layout'
import { Metadata, type NextPage } from "next";
import { Button } from "components/ui/button"

import { Plus, Download, Users, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog"
import { Label } from "components/ui/label"
import { api } from '~/utils/api';
import { useContext, useState } from 'react';
import { DataTable } from 'components/clientes/data-table/data-table-component';
import { columns } from 'components/clientes/data-table/columns-funcionarios';
import { Input } from 'components/ui/input';
import { User } from '@prisma/client';
import { Checkbox } from "components/ui/checkbox"
import AuthContext from 'components/auth_context';
import { faker } from '@faker-js/faker';

export default function Page() {

    const auth_context = useContext(AuthContext)

    const { data: funcionarios, error, isLoading, refetch } = api.funcionario.getFuncionarios.useQuery()
    const mutationDelete = api.funcionario.deleteFuncionarios.useMutation();
    const mutationCreate = api.funcionario.createFuncionario.useMutation();
    const mutateExcluir = async (ids: string[]) => {
        await mutationDelete.mutateAsync({ids})
        await refetch()
        return { ok: true }
    }
    const [nameFilter, setNameFilter] = useState('')
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loadingCreate, setLoadingCreate] = useState(false)

    const createFuncionario = async (isAdmin = false) => {
        try {
            if (nome === '' || email === '' || password === '') return alert('Preencha todos os campos')
            setLoadingCreate(true)
            await mutationCreate.mutateAsync({nome, email, password, isAdmin})
            setLoadingCreate(false)
            setNome('')
            setEmail('')
            setPassword('')
            await refetch()
        } catch (error) {
            alert('Algum erro ocorreu ao criar o funcionário')
        }
    }

    if (!auth_context.isAdmin) return <div></div>
    if (isLoading) return <div></div>
    if (error) return <div>Erro: {error.message}</div>

    const filteredFuncionarios = funcionarios.filter(cliente => cliente.nome.toLowerCase().includes(nameFilter.toLowerCase()))

    return <div className="flex-1 space-y-4 p-8 pt-6">
    <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Funcionários</h2>
        <div className="flex items-center space-x-2">
        
            <Input
                type="search"
                placeholder="Busque por nome"
                className="h-9 md:w-[100px] lg:w-[300px]"
                onChange={e => setNameFilter(e.target.value)}
                value={nameFilter}
            />
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Funcionário
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Cadastro de novo funcionário</DialogTitle>
                        <DialogDescription>
                            Crie um novo usuário para ter acesso ao sistema.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                            Nome
                            </Label>
                            <Input id="nome" value={nome} onChange={e => setNome(e.target.value)} placeholder={faker.person.fullName()} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                            Email
                            </Label>
                            <Input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={faker.internet.email()} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                            Senha
                            </Label>
                            <Input id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={faker.internet.password()} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={loadingCreate} onClick={() => void createFuncionario(true)} type="submit" variant="outline">
                            {
                                loadingCreate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            }
                            Criar Administrador
                        </Button>
                        <Button disabled={loadingCreate} onClick={() => void createFuncionario(false)} type="submit">
                            {
                                loadingCreate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            }
                            Criar funcionário
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </div>
    <DataTable columns={columns} deleteMutate={mutateExcluir} refetch={refetch} data={filteredFuncionarios
        .sort((a, b) => new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())
        .map(cliente => ({...cliente, mutateExcluir: () => mutateExcluir([cliente.id]) }))
        } />
    </div>
}

Page.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}