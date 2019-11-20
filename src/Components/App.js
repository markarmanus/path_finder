import React, { useState } from "react"
import Grid from "./Grid"
import Player from "./Player"
import NavBar from "./NavBar"
import Footer from "./Footer"

function App() {
  const [textureSize, setTextureSize] = useState(100)
  return (
    <div style={{ display: "flex", flexFlow: "column", height: "100%" }}>
      <NavBar setTextureSize={setTextureSize}></NavBar>
      <Grid textureSize={textureSize}></Grid>
      <Player></Player>
      <Footer></Footer>
    </div>
  )
}

export default App
