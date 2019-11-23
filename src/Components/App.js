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
      inProgress: false,
      paused: false,
      ready: false,
      followCursor: false,
      playerSpeed: CONFIG.DEFAULT_PLAYER_SPEED,
      thiefSpeed: CONFIG.DEFAULT_THIEF_SPEED
    }
    this.onClickUndo = this.onClickUndo.bind(this)
    this.setTextureSize = this.setTextureSize.bind(this)
    this.setSelectedEditTexture = this.setSelectedEditTexture.bind(this)
    this.setEditing = this.setEditing.bind(this)
    this.onClickStart = this.onClickStart.bind(this)
    this.onClickRestart = this.onClickRestart.bind(this)
    this.onClickPause = this.onClickPause.bind(this)
    this.onClickStart = this.onClickStart.bind(this)
    this.onClickResume = this.onClickResume.bind(this)
    this.setCharacterSpeed = this.setCharacterSpeed.bind(this)
    this.envIsReady = this.envIsReady.bind(this)
    this.enableFollowCursor = this.enableFollowCursor.bind(this)
  }
  enableFollowCursor() {
    if (this.state.ready) {
      this.setState({ followCursor: true, inProgress: true })
    }
  }
  setCharacterSpeed(type, speed) {
    this.setState({ [type + "Speed"]: speed })
  }
  onClickUndo() {
    this.grid.undoEdit()
  }
  setTextureSize(size) {
    this.setState({ textureSize: size })
    this.onClickRestart()
  }
  envIsReady() {
    this.setState({ ready: true })
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
    this.setState({ inProgress: true })
  }
  onClickRestart() {
    this.setState({
      paused: false,
      inProgress: false,
      selectedEditTexture: null,
      editing: false,
      followCursor: false
    })
    this.grid.onClickRestart()
  }
  onClickPause() {
    this.setState({ paused: true })
  }
  onClickResume() {
    this.setState({ paused: false })
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
          onChangeCharacterSpeed={this.setCharacterSpeed}
          playerSpeed={this.state.playerSpeed}
          paused={this.state.paused}
          onClickResume={this.onClickResume}
          onClickPause={this.onClickPause}
          onClickRestart={this.onClickRestart}
          thiefSpeed={this.state.thiefSpeed}
          ready={this.state.ready}
          onClickStart={this.onClickStart}
          enableFollowCursor={this.enableFollowCursor}
          onSelectEditTexture={this.setSelectedEditTexture}
          selectedEditTexture={this.state.selectedEditTexture}
          followCursor={this.state.followCursor}
          inProgress={this.state.inProgress}
        ></NavBar>
        <Grid
          onRef={ref => (this.grid = ref)}
          textureSize={this.state.textureSize}
          paused={this.state.paused}
          playerSpeed={this.state.playerSpeed}
          paused={this.state.paused}
          thiefSpeed={this.state.thiefSpeed}
          editing={this.state.editing}
          selectedEditTexture={this.state.selectedEditTexture}
          setSelectedEditTexture={this.setSelectedEditTexture}
          inProgress={this.state.inProgress}
          followCursor={this.state.followCursor}
          envIsReady={this.envIsReady}
        ></Grid>
        <Footer></Footer>
      </MainContainer>
    )
  }
}

export default App
