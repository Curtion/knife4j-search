import { Card, Space } from 'antd'

function formatData(data: Array<ServerList>): Array<Server> {
  const url = localStorage.getItem('url')
  const result: Array<Server> = []
  for (let i = 0; i < data.length; i++) {
    for (const key in data[i].swagger.paths) {
      const value = data[i].swagger.paths[key]
      for (const method in value) {
        const item = value[method]
        result.push({
          name: `${item.tags[0] ?? ''}/${item.summary}`,
          url: key,
          method: method.toUpperCase(),
          blinkURL: `${url}/doc.html#/${data[i].name}/${item.tags[0] ?? ''}/${item.operationId}`,
        })
      }
    }
  }
  return result
}

function filterData(data: Array<Server>, value: string) {
  const result = data.filter(item => item.name.includes(value) || item.url.includes(value) || item.method.includes(value) || item.blinkURL.includes(value))
  return result
}

function Content(data: Array<ServerList>, value: string) {
  const result = filterData(formatData(data), value)
  if (result.length === 0) {
    return (
      <div className='h-70vh m-a flex justify-center'>
        <div className='flex justify-center items-center'>
          暂无数据
        </div>
      </div>
    )
  } else {
    return (
      <Space direction="vertical" size={16} className='mt-2'>
        {result.map(item => <div key={item.blinkURL}>{MyCard(item)}</div>)}
      </Space>
    )
  }
}

function MyCard(data: Server) {
  return (
    <Card title={data.name} bordered={false} style={{ width: 600 }}>
      <p><span className='c-fuchsia'>{data.method}</span><span className='ml-2 c-orange'>{data.url}</span></p>
      <a href={data.blinkURL} target='__blink'>{data.blinkURL}</a>
    </Card>
  )
}

export default Content
