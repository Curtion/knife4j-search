import { useEffect, useState } from 'react'
import { Input, Modal, Spin } from 'antd'
import { fetch } from '@tauri-apps/api/http'
import Content from './components/Content'

async function init(): Promise<Array<ServerList>> {
  const url = localStorage.getItem('url')
  if (url) {
    const res = await fetch(`${url}/swagger-resources`, {
      method: 'GET',
      timeout: 300,
    })
    const data = await res.data as Array<ServerList>
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      item.swagger = await getSwagger(`${url}${item.url}`)
    }
    return data
  }
  return [] as Array<ServerList>
}

async function getSwagger(url: string) {
  const res = await fetch(url, {
    method: 'GET',
    timeout: 300,
  })
  const data = await res.data
  return data
}

function App() {
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState('')
  const [result, setResult] = useState<Array<ServerList>>([])
  const [url, setURL] = useState(localStorage.getItem('url') ?? '')

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOk = () => {
    try {
      const reg = new URL(url)
      localStorage.setItem('url', reg.origin ?? '')
      setLoading(true)
      init().then((res) => {
        setResult(res)
        setLoading(false)
      })
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error)
    }
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    setLoading(true)
    init().then((res) => {
      setResult(res)
      setLoading(false)
    })
  }, [])

  const setting = () => {
    setURL(localStorage.getItem('url') ?? '')
    setIsModalOpen(true)
  }

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }, 500)

  return (
    <>
      <div className='h-30vh flex justify-center items-center bg-gray-300'>
        <Input placeholder="请输入要搜索的内容" className='w-50vw' allowClear onChange={handleSearch} />
        <button className="ml-2 text-xl hover:cursor-pointer i-carbon-settings" onClick={setting} />
      </div>
      <div className='min-h-70vh m-a flex justify-center bg-gray-200'>
        {loading ? (<div className='h-70vh m-a flex justify-center items-center bg-gray-200' ><Spin /></div>) : Content(result, value)}
      </div>
      <Modal title="提示" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input placeholder="请输入要搜索的knife4j地址" value={url} onChange={e => setURL(e.target.value)} />
      </Modal>
    </>
  )
}

export default App
