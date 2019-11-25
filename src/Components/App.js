import React, { Component } from "react"
import Grid from "./Grid"
import NavBar from "./NavBar"
import Footer from "./Footer"
import { CONFIG } from "../Constants/Config"
import styled from "styled-components"
import { TEXTURES } from "../Constants/Textures"
import queryString from "query-string"

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
      initialTexturesMap: [],
      initialOverLayMap: [],
      playerSpeed: CONFIG.DEFAULT_PLAYER_SPEED,
      fromURLInitialPlayerLocation: null,
      fromURLInitialThiefLocation: null,
      playerMaxHealth: CONFIG.DEFAULT_PLAYER_HEALTH,
      thiefMaxHealth: CONFIG.DEFAULT_THIEF_HEALTH,
      healthImportance: CONFIG.DEFAULT_HEALTH_IMPORTANCE,
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
    this.setCharacterMaxHealth = this.setCharacterMaxHealth.bind(this)
    this.setHealthImportance = this.setHealthImportance.bind(this)
    this.generateLink = this.generateLink.bind(this)
  }
  generateLink() {
    this.grid.updateURL()
  }
  setCharacterMaxHealth(type, value) {
    this.setState({ [type + "MaxHealth"]: value })
  }
  componentWillMount() {
    let params = queryString.parse(this.props.location.search, {
      arrayFormat: "comma",
      parseNumbers: true
    })
    this.setState({
      playerSpeed: params.playerSpeed !== undefined ? params.playerSpeed : this.state.playerSpeed,
      playerMaxHealth:
        params.playerMaxHealth !== undefined ? params.playerMaxHealth : this.state.playerMaxHealth,
      thiefMaxHealth:
        params.thiefMaxHealth !== undefined ? params.thiefMaxHealth : this.state.thiefMaxHealth,
      initialTexturesMap: params.initialTexturesMap !== undefined ? params.initialTexturesMap : [],
      initialOverLayMap: params.initialOverLayMap !== undefined ? params.initialOverLayMap : [],
      healthImportance:
        params.healthImportance !== undefined
          ? params.healthImportance
          : this.state.healthImportance,
      thiefSpeed: params.thiefSpeed !== undefined ? params.thiefSpeed : this.state.thiefSpeed,
      textureSize: params.textureSize !== undefined ? params.textureSize : this.state.textureSize,
      fromURLInitialPlayerLocation:
        params.fromURLInitialPlayerLocation !== undefined
          ? params.fromURLInitialPlayerLocation
          : this.state.fromURLInitialPlayerLocation,
      fromURLInitialThiefLocation:
        params.fromURLInitialThiefLocation !== undefined
          ? params.fromURLInitialThiefLocation
          : this.state.fromURLInitialThiefLocation
    })
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
  setHealthImportance(value) {
    this.setState({ healthImportance: value })
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
          onChangeCharacterMaxHealth={this.setCharacterMaxHealth}
          playerSpeed={this.state.playerSpeed}
          paused={this.state.paused}
          onClickResume={this.onClickResume}
          onClickPause={this.onClickPause}
          onClickRestart={this.onClickRestart}
          playerMaxHealth={this.state.playerMaxHealth}
          thiefMaxHealth={this.state.thiefMaxHealth}
          healthImportance={this.state.healthImportance}
          onChangeHealthImportance={this.setHealthImportance}
          thiefSpeed={this.state.thiefSpeed}
          ready={this.state.ready}
          generateLink={this.generateLink}
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
          playerMaxHealth={this.state.playerMaxHealth}
          thiefMaxHealth={this.state.thiefMaxHealth}
          initialTexturesMap={this.state.initialTexturesMap}
          initialOverLayMap={this.state.initialOverLayMap}
          playerMaxHealth={this.state.playerMaxHealth}
          thiefMaxHealth={this.state.thiefMaxHealth}
          fromURLInitialPlayerLocation={this.state.fromURLInitialPlayerLocation}
          fromURLInitialThiefLocation={this.state.fromURLInitialThiefLocation}
          editing={this.state.editing}
          selectedEditTexture={this.state.selectedEditTexture}
          setSelectedEditTexture={this.setSelectedEditTexture}
          healthImportance={this.state.healthImportance}
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
