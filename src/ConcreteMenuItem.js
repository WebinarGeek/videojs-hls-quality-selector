import videojs from 'video.js'

const VideoJsMenuItemClass = videojs.getComponent('MenuItem')

/**
 * Extend vjs menu item class.
 */
export default class ConcreteMenuItem extends VideoJsMenuItemClass {
  /**
   * Menu item constructor.
   *
   * @param {Player} player - vjs player
   * @param {Object} item - Item object
   * @param {ConcreteButton} qualityButton - The containing button.
   * @param {HlsQualitySelectorPlugin} plugin - This plugin instance.
   */
  constructor(player, item, plugin) {
    super(player, {
      label: item.label, selectable: true, selected: item.selected || false
    })
    this.item = item
    this.plugin = plugin
  }

  handleClick() {
    this.plugin.setQuality(this.item)
  }
}
