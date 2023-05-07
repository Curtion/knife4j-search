import { useEffect, useState } from 'react'
import { Input } from 'antd'
import Content from './components/Content'

async function init(): Promise<Array<ServerList>> {
  const url = localStorage.getItem('url')
  if (url) {
    const res = await fetch(`${url}/swagger-resources`)
    const data = await res.json() as Array<ServerList>
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      item.swagger = await getSwagger(`${url}${item.url}`)
    }
    return data
  }
  return [] as Array<ServerList>
}

async function getSwagger(url: string) {
  const res = await fetch(url)
  const data = await res.json()
  return data
}

function App() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<Array<ServerList>>([])

  useEffect(() => {
    init().then(res => setResult(res))
  }, [])

  const setting = async () => {
    let url = localStorage.getItem('url') ?? ''
    // eslint-disable-next-line no-alert
    const value = prompt('请输入要搜索的knife4j地址', url)
    if (value === null) {
      return
    }
    try {
      const reg = new URL(value)
      url = reg.origin
      localStorage.setItem('url', url ?? '')
      setResult(await init())
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('请输入正确的knife4j地址')
    }
  }

  return (
    <>
      <div className='h-30vh flex justify-center items-center bg-gray-300'>
          <Input placeholder="请输入要搜索的内容" className='w-50vw' allowClear onChange={e => setValue(e.target.value)} />
        <button className="ml-2 text-xl hover:cursor-pointer i-carbon-settings" onClick={setting} />
      </div>
      <div className='min-h-70vh m-a flex justify-center bg-gray-200'>
        {Content(result, value)}
      </div>
    </>
  )
}

export default App
