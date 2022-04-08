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

    // If there is quality levels plugin and the HLS tech exists
    // then continue.
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
    const player = this.player

    this._qualityButton = new ConcreteButton(player)

    const placementIndex = player.controlBar.children().length - 2
    const concreteButtonInstance = player.controlBar.addChild(this._qualityButton, {
      componentClass: 'qualitySelector'
    }, this.config.placementIndex || placementIndex)

    concreteButtonInstance.addClass('vjs-quality-selector')
    if (this.config.displayCurrentQuality) {
      this.setButtonInnerText('auto')
    } else {
      const icon = ` ${this.config.vjsIconClass || 'vjs-icon-hd'}`

      concreteButtonInstance
        .menuButton_.$('.vjs-icon-placeholder').className += icon
    }
    concreteButtonInstance.removeClass('vjs-hidden')
  }

  /**
   *Set inner button text.
   *
   * @param {string} text - the text to display in the button.
   */
  setButtonInnerText(text) {
    this._qualityButton
      .menuButton_.$('.vjs-icon-placeholder').innerHTML = text
  }

  /**
   * Builds individual quality menu items.
   *
   * @param {Object} item - Individual quality menu item.
   * @return {ConcreteMenuItem} - Menu item
   */
  getQualityMenuItem(item) {
    const player = this.player

    return new ConcreteMenuItem(player, item, this._qualityButton, this)
  }

  /**
   * Executed when a quality level is added from HLS playlist.
   */
  onAddQualityLevel() {
    const player = this.player
    const qualityList = player.qualityLevels()
    const levels = qualityList.levels_ || []
    const levelItems = []

    for (let i = 0; i < levels.length; ++i) {
      if (!levels[i].height) continue

      if (!levelItems.filter((_existingItem) => _existingItem.item && _existingItem.item.value === levels[i].height).length) {
        const levelItem = this.getQualityMenuItem.call(this, {
          label: `${levels[i].height}p`,
          value: levels[i].height
        })

        levelItems.push(levelItem)
      }
    }

    levelItems.sort((current, next) => {
      if ((typeof current !== 'object') || (typeof next !== 'object')) return -1

      if (current.item.value < next.item.value) return -1

      if (current.item.value > next.item.value) return 1

      return 0
    })

    levelItems.push(this.getQualityMenuItem.call(this, {
      label: player.localize('Auto'),
      value: 'auto',
      selected: true
    }))

    if (this._qualityButton) {
      this._qualityButton.createItems = () => levelItems
      this._qualityButton.update()
    }
  }

  /**
   * Set the quality to a stream based on name, bitrate and/or height.
   *
   * @param {name?: string, bitrate?: number, height?: number} - Filters to find a stream
   */
  setQuality(height) {
    const qualityList = this.player.qualityLevels()

    // Set quality on plugin
    this._currentQuality = height

    if (this.config.displayCurrentQuality) this.setButtonInnerText(height === 'auto'
      ? height
      : `${height}p`)

    for (let i = 0; i < qualityList.length; ++i) {
      const quality = qualityList[i]

      quality.enabled = (quality.height === height || height === 'auto')
    }
    this._qualityButton.unpressButton()
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
