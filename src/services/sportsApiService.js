require('dotenv').config()
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args))

const API_KEY = process.env.SPORTS_API_KEY
const HEADERS = { Authorization: API_KEY }

console.log('API KEY loaded:', API_KEY)

const searchNBAPlayers = async (name) => {
  try {
    const url = `https://api.balldontlie.io/v1/players?search=${encodeURIComponent(name)}&per_page=10`
    const res = await fetch(url, { headers: HEADERS })
    const data = await res.json()
    console.log('NBA API response:', JSON.stringify(data).slice(0, 200))
    return (data.data || []).map(p => ({
      externalId: String(p.id),
      sport: 'basketball',
      name: `${p.first_name} ${p.last_name}`,
      firstname: p.first_name,
      lastname: p.last_name,
      team: p.team?.full_name || '',
      position: p.position || '',
      nationality: '',
      photo: '',
      height: p.height || '',
      weight: p.weight || ''
    }))
  } catch (error) {
    console.error('NBA API error:', error.message)
    return []
  }
}

const searchSoccerPlayers = async (name) => {
  try {
    const url = `https://api.balldontlie.io/epl/v2/players?search=${encodeURIComponent(name)}&per_page=10`
    const res = await fetch(url, { headers: HEADERS })
    const data = await res.json()
    console.log('Soccer API response:', JSON.stringify(data).slice(0, 200))
    return (data.data || []).map(p => ({
      externalId: String(p.id),
      sport: 'soccer',
      name: p.display_name || `${p.first_name} ${p.last_name}`,
      firstname: p.first_name,
      lastname: p.last_name,
      team: p.team?.name || '',
      position: p.position || '',
      nationality: p.citizenship || '',
      photo: '',
      height: p.height || '',
      weight: p.weight || ''
    }))
  } catch (error) {
    console.error('Soccer API error:', error.message)
    return []
  }
}

module.exports = { searchNBAPlayers, searchSoccerPlayers }