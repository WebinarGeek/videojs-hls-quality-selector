import videojs from 'video.js'
import ConcreteButton from './ConcreteButton.js'
import ConcreteMenuItem from './ConcreteMenuItem.js'

/**
 * VideoJS HLS Quality Selector Plugin class.
 */
class HlsQualitySelectorPlugin {
  /**
   * Plugin Constructor.
   *
   * @param {Player} player - The videojs player instance.
   * @param {Object} options - The plugin options.
   */
  constructor(player, options) {
    this.player = player
    this.config = options
    // If there is quality levels plugin and the HLS tech exists then continue.
    if (this.player.qualityLevels && this.getHls()) {
      // Create the quality button.
      this.createQualityButton()
      this.bindPlayerEvents()
    }
  }

  /**
   * Returns HLS Plugin
   *
   * @return {*} - videojs-hls-contrib plugin.
   */
  getHls() {
    return this.player.tech({ IWillNotUseThisInPlugins: true }).hls
  }

  /**
   * Binds listener for quality level changes.
   */
  bindPlayerEvents() {
    this.player.qualityLevels().on('addqualitylevel', this.onAddQualityLevel.bind(this))
  }

  /**
   * Adds the quality menu button to the player control bar.
   */
  createQualityButton() {
    this._qualityButton = new ConcreteButton(this.player)
    const placementIndex = this.player.controlBar.children().length - 2
    const concreteButtonInstance = this.player.controlBar.addChild(this._qualityButton, {
      componentClass: 'qualitySelector'
    }, this.config.placementIndex || placementIndex)
    concreteButtonInstance.addClass('vjs-quality-selector')
    const icon = this.config.vjsIconClass || 'vjs-icon-hd'
    if (this.config.displayCurrentQuality) this.setButtonInnerText('auto')
    else concreteButtonInstance.menuButton_.$('.vjs-icon-placeholder').classList.add(icon)
    concreteButtonInstance.removeClass('vjs-hidden')
  }

  /**
   * Set inner button text.
   *
   * @param {string} text - the text to display in the button.
   */
  setButtonInnerText(text) {
    this._qualityButton.menuButton_.$('.vjs-icon-placeholder').innerHTML = text
  }

  /**
   * Builds individual quality menu items.
   *
   * @param {Object} item - Individual quality menu item.
   * @return {ConcreteMenuItem} - Menu item
   */
  getQualityMenuItem(item) {
    return new ConcreteMenuItem(this.player, item, this._qualityButton, this)
  }

  /**
   * Executed when a quality level is added from HLS playlist.
   */
  onAddQualityLevel() {
    const qualityLevels = Array.from(this.player.qualityLevels() || [])
    const levelItems = qualityLevels.map((ql) => this.getQualityMenuItem({
      label: niceLabel(ql), height: ql.height || 0, bitrate: ql.bitrate || 0
    })).sort((current, next) => {
      if ((typeof current !== 'object') || (typeof next !== 'object')) return -1
      if (current.item.height < next.item.height) return -1
      if (current.item.height > next.item.height) return 1
      return 0
    })
    levelItems.push(this.getQualityMenuItem({
      label: 'Auto', height: 'auto', selected: true
    }))
    if (this._qualityButton) {
      this._qualityButton.createItems = () => levelItems
      this._qualityButton.update()
    }
  }

  /**
   * Set the quality to a stream based on name, bitrate and/or height.
   * You may also pass a height "auto" to switch back to the automatic selection.
   * This is not the same as supplying empty filters, because that would select the first.
   *
   * @param {name?: string, bitrate?: number, height?: number | 'auto'} - Filters to find a stream
   *
   * @return {boolean} if a stream was found and switched to based on the filters
   */
  setQuality(filters = {}) {
    const qualityList = Array.from(this.player.qualityLevels() || [])
    if (filters.height === 'auto') {
      qualityList.forEach((ql) => {
        ql.enabled = true
      })
      this._currentQuality = 'auto'
      this._qualityButton.unpressButton()
      return true
    }
    const levels = qualityList.filter((ql) => (!filters.name || filters.name === ql.name)
      && (!filters.bitrate || filters.bitrate === ql.bitrate)
      && (!filters.height || filters.height === ql.height))
    const match = levels?.[0]
    if (!match) return false
    if (this.config.displayCurrentQuality) this.setButtonInnerText(niceLabel(match))
    qualityList.forEach((ql) => {
      ql.enabled = match === ql
    })
    this._currentQuality = match
    this._qualityButton.unpressButton()
    return true
  }

  /**
   * Return the quality and info of the currently selected stream.
   *
   * @return {string} the currently set quality
   */
  getQuality() {
    return this._currentQuality || 'auto'
  }
}

const niceLabel = (item) => {
  if (item.height && item.bitrate) return `${item.height}p (${item.bitrate / 1000}kb)`
  if (item.height) return `${item.height}p`
  return `${item.bitrate / 1000}kb`
}

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
const onPlayerReady = (player, options) => {
  player.addClass('vjs-hls-quality-selector')
  player.hlsQualitySelector = new HlsQualitySelectorPlugin(player, options)
}

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function hlsQualitySelector
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const hlsQualitySelector = function hlsQualitySelector(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions({}, options))
  })
}

// Register and export the plugin
videojs.registerPlugin('hlsQualitySelector', hlsQualitySelector)
hlsQualitySelector.VERSION = '2.0.0-dev'
window.hlsQualitySelector = hlsQualitySelector
window.videojs?.registerPlugin('hlsQualitySelector', hlsQualitySelector)
export default hlsQualitySelector
