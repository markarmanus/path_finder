import React, { Component } from "react"
import Grid from "./Grid"
import NavBar from "./NavBar"
import Footer from "./Footer"
import { CONFIG } from "../Constants/Config"
import styled from "styled-components"
import { TEXTURES } from "../Constants/Textures"
import queryString from "query-string"
import { LEVELS } from "../Constants/Levels"

const MainContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`
export class App extends Component {
  constructor(props) {
    super(props)
    let params = this.parseLevelData(this.props.location.search)
    this.state = {
      textureSize: params.textureSize ? params.textureSize : CONFIG.DEFAULT_TEXTURE_SIZE,
      selectedEditTexture: null,
      editing: false,
      selectedLevel: CONFIG.DEFAULT_SELECTED_LEVEL,
      inProgress: false,
      paused: false,
      ready: false,
      followCursor: false,
      allowDiagonalActions: params.allowDiagonalActions ? params.allowDiagonalActions : false,
      initialTexturesMap: params.initialTexturesMap ? params.initialTexturesMap : [],
      initialOverLayMap: params.initialOverLayMap ? params.initialOverLayMap : [],
      playerSpeed: params.playerSpeed ? params.playerSpeed : CONFIG.DEFAULT_PLAYER_SPEED,
      firstRenderPlayerLocation: params.firstRenderPlayerLocation
        ? params.firstRenderPlayerLocation
        : null,
      firstRenderThiefLocation: params.firstRenderThiefLocation
        ? params.firstRenderThiefLocation
        : null,
      playerMaxHealth: params.playerMaxHealth
        ? params.playerMaxHealth
        : CONFIG.DEFAULT_PLAYER_HEALTH,
      searchPriority: params.searchPriority
        ? params.searchPriority
        : CONFIG.DEFAULT_SEARCH_PRIORITY,
      thiefSpeed: params.thiefSpeed ? params.thiefSpeed : CONFIG.DEFAULT_THIEF_SPEED
    }
    this.onClickUndo = this.onClickUndo.bind(this)
    this.setTextureSize = this.setTextureSize.bind(this)
    this.setSelectedEditTexture = this.setSelectedEditTexture.bind(this)
    this.setEditing = this.setEditing.bind(this)
    this.onClickStart = this.onClickStart.bind(this)
    this.onClickRestart = this.onClickRestart.bind(this)
    this.onClickPause = this.onClickPause.bind(this)
    this.onClickResume = this.onClickResume.bind(this)
    this.setCharacterSpeed = this.setCharacterSpeed.bind(this)
    this.envIsReady = this.envIsReady.bind(this)
    this.enableFollowCursor = this.enableFollowCursor.bind(this)
    this.setCharacterMaxHealth = this.setCharacterMaxHealth.bind(this)
    this.setSearchPriority = this.setSearchPriority.bind(this)
    this.onFinishGame = this.onFinishGame.bind(this)
    this.generateLink = this.generateLink.bind(this)
    this.setAllowDiagonalActions = this.setAllowDiagonalActions.bind(this)
    this.setSelectedLevel = this.setSelectedLevel.bind(this)
    this.parseLevelData = this.parseLevelData.bind(this)
  }
  parseLevelData(value) {
    return queryString.parse(value, {
      arrayFormat: "comma",
      parseNumbers: true,
      parseBooleans: true
    })
  }
  setSelectedLevel(level) {
    let levelData = this.parseLevelData(LEVELS[level])
    this.setState({ selectedLevel: level, ...levelData }, () =>
      this.grid.onSelectCustomLevel(levelData)
    )
  }
  setAllowDiagonalActions(value) {
    this.setState({ allowDiagonalActions: value })
  }
  onFinishGame() {
    this.setState({ inProgress: false })
  }
  generateLink() {
    this.grid.updateURL()
  }
  setCharacterMaxHealth(type, value) {
    this.setState({ [type + "MaxHealth"]: value })
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
  setSearchPriority(value) {
    this.setState({ searchPriority: value })
  }
  render() {
    return (
      <MainContainer>
        <NavBar {...this} {...this.state}></NavBar>
        <Grid onRef={ref => (this.grid = ref)} {...this.state} {...this}></Grid>
        <Footer></Footer>
      </MainContainer>
    )
  }
}

export default App
