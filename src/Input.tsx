import { useState } from 'react'
import { CSVLink } from 'react-csv'

import { formatData, getRunByUserName } from './util'
import './styles.css'

const headers = [
  { label: 'Game', key: 'game' },
  { label: 'Level', key: 'level' },
  { label: 'Category', key: 'category' },
  { label: 'Video', key: 'videos' },
  { label: 'Comment', key: 'comment' },
  { label: 'Other players', key: 'players' },
  { label: 'Date', key: 'date' },
  { label: 'RTA', key: 'rta' },
  { label: 'IGT', key: 'igt' },
  { label: 'RTA (no loads)', key: 'rta_noloads' },
  { label: 'Platform', key: 'platform' },
  { label: 'Emulator', key: 'emulator' },
  { label: 'Region', key: 'region' },
]

const Input = () => {
  const [name, setName] = useState('')
  const [data, setData] = useState<any>(null)
  const [status, setStatus] = useState<string | null>(null)

  const getFormattedData = (e: any) => {
    e.preventDefault()
    setData(null)
    setStatus('Loading...')
    getRunByUserName(name).then((res) => {
      if (!res) {
        return setStatus('User not found')
      }
      const formattedData = formatData(res, name)
      setData(formattedData)
      setStatus(null)
    })
  }

  return (
    <div className='main'>
      <h1>SRC profile export</h1>

      <form onSubmit={(e) => getFormattedData(e)}>
        <input onChange={(e) => setName(e.target.value)} value={name} placeholder='speedrun.com username'></input>
        <button type='submit' disabled={status === 'Loading...'}>
          Fetch runs
        </button>
      </form>

      {status && <div>{status}</div>}

      {data && (
        <CSVLink data={data} headers={headers} filename={`src_${name}.csv`}>
          Download CSV
        </CSVLink>
      )}

      <div>
        If the export seems to get stuck, speedrun.com servers are the likely cause and you should just try again.
      </div>
      <div>
        If you encounter or suspect other issues, contact{' '}
        <a href='https://twitter.com/TheKotti'>@TheKotti on Twitter</a> or Kotti#6548 on Discord.
      </div>
    </div>
  )
}

export default Input
