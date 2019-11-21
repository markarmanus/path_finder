import React, { Component } from "react"
import Grid from "./Grid"
import NavBar from "./NavBar"
import Footer from "./Footer"
import { CONFIG } from "../Constants/Config"
import styled from "styled-components"
import { TEXTURES } from "../Constants/Textures"

const MainContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`
export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      textureSize: CONFIG.DEFAULT_TEXTURE_SIZE,
      selectedEditTexture: null,
      editing: false,
      inProgress: false
    }
    this.onClickUndo = this.onClickUndo.bind(this)
    this.setTextureSize = this.setTextureSize.bind(this)
    this.setSelectedEditTexture = this.setSelectedEditTexture.bind(this)
    this.setEditing = this.setEditing.bind(this)
    this.onClickStart = this.onClickStart.bind(this)
  }
  onClickUndo() {
    this.grid.undoEdit()
  }
  setTextureSize(size) {
    this.setState({ textureSize: size })
  }

  setEditing(value) {
    this.setState({ editing: value })
  }
  setSelectedEditTexture(texture) {
    let isEditing =
      texture !== null && texture !== TEXTURES.PLAYER_IDLE && texture !== TEXTURES.THIEF_IDLE
    this.setState({
      selectedEditTexture: texture,
      editing: isEditing
    })
  }
  onClickStart() {
    console.log("start clickerd")
    this.setState({ inProgress: true })
  }
  render() {
    return (
      <MainContainer>
        <NavBar
          onClickUndo={this.onClickUndo}
          setTextureSize={this.setTextureSize}
          textureSize={this.state.textureSize}
          editing={this.state.editing}
          setEditing={this.setEditing}
          onClickStart={this.onClickStart}
          onSelectEditTexture={this.setSelectedEditTexture}
          selectedEditTexture={this.state.selectedEditTexture}
        ></NavBar>
        <Grid
          onRef={ref => (this.grid = ref)}
          textureSize={this.state.textureSize}
          editing={this.state.editing}
          selectedEditTexture={this.state.selectedEditTexture}
          setSelectedEditTexture={this.setSelectedEditTexture}
          inProgress={this.state.inProgress}
        ></Grid>
        <Footer></Footer>
      </MainContainer>
    )
  }
}

export default App
