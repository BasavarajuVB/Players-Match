const express = require('express')
const {open} = require('sqlite')
const path = require('path')
const sqlite3 = require('sqlite3')

const dbPath = path.join(__dirname, 'cricketMatchDetails.db')
const app = express()
let db = null
const initailizeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3001, () => {
      console.log('Server Running at http://localhost:3001')
    })
  } catch (e) {
    console.log(`DB Error ${e.message}`)
    process.exit(1)
  }
}

initailizeDbAndServer()

const convertDataIntoServerData = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
  }
}

app.get('/players/', async (request, response) => {
  const allThePlayers = `
  SELECT 
    * 
  FROM 
   player_details;
  `
  const allPlayersData = await db.all(allThePlayers)
  response.send(allPlayersData.map(each => convertDataIntoServerData(each)))
})

module.exports = app
