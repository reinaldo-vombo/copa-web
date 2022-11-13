import Image from "next/image"
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import userAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from "../lib/axios"
import { FormEvent, useState } from "react"

interface HomeProps {
  poolcount: number;
  guesscount: number;
  usercount: number;
}
export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')
  

  async function createPool(event: FormEvent){
    event.preventDefault()
    try{

      const response = await api.post('/pools', {
        title: poolTitle,
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)
      alert('Bolão criado com sucesso, o código foi copiado para área de trasferencia')
      setPoolTitle('')
    
    
    }catch (err) {
      console.log(err)
      alert('Falha ao criar bolão, tenta novamente!')
    }
  }
  
  return (
    <>
     <div className="max-w-[1124px] mx-auto grid h-screen gap-28 grid-cols-2 items-center">
      <main>
        <Image src={logoImg} alt='NLW Copa'/>
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">Crie seu prório boão da copa e compartilhe entre amigos!</h1>

        <div className="mt-10 items-center flex gap-2">
          <Image src={userAvatarExampleImg} alt=''/>
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usercount}</span>
            pessoas já estão usando
          </strong>
        </div>
        <form onSubmit={createPool} className="mt-10 flex gap-2" action="">
          <input
            className="
              flex-1 px-6 py-4 
              rounded bg-gray-800 border
              border-gray-600 text-sm
              text-gray-100
              " 
            type="text"
            required 
            placeholder="Qual nome do seu bolão"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle} />
            <button 
            className="
            bg-yellow-500 px-6 py-4 rounded text-gray-900
              font-bold text-sm uppercase hover:bg-yellow-600
              " 
              type="submit">
            Criar seu boão
          </button>
        </form>
          <p className="mt-4 text-sm text-gray-300 leading-relaxed">Após Criar seu bolão, você receber+a um código único que podera usar para convidar seus amigos</p>
        
        <div className="mt-10 pt-10 border-t flex items-center justify-between border-gray-600 text-gray-100">
          <div  className="flex items-center gap-6">
            <div>
              <Image src={iconCheckImg} alt=''/>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolcount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600"/>
          <div className="flex items-center gap-6">
            <div>
              <Image src={iconCheckImg} alt=''/>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guesscount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
     
      <Image src={appPreviewImg} alt='Dois telefone exibindo uma prévia da aplicação movel'/>
     </div>
    </>
  )
}

export const getServerSideProps = async () => {
 
const [poolCountResponse, guessCountResponse, usersCountResponse] = await Promise.all([
  api.get('pools/count'),
  api.get('guesses/count'),
  api.get('users/count'),
])

  return {
    props: {
      poolcount: poolCountResponse.data.count,
      guesscount: guessCountResponse.data.count,
      usercount: usersCountResponse.data.count,
    }
  }
}
