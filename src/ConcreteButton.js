import videojs from 'video.js'

const VideoJsButtonClass = videojs.getComponent('MenuButton')
const VideoJsMenuClass = videojs.getComponent('Menu')

/**
 * Extend vjs button class for quality button.
 */
export default class ConcreteButton extends VideoJsButtonClass {
  /**
   * Button constructor.
   *
   * @param {Player} player - videojs player instance
   */
  constructor(player) {
    super(player, {
      name: 'QualityButton'
    })
  }

  /**
   * Creates button items.
   *
   * @return {Array} - Button items
   */
  createItems() {
    return []
  }

  /**
   * Create the menu and add all items to it.
   *
   * @return {Menu} - The constructed menu
   */
  createMenu() {
    const menu = new VideoJsMenuClass(this.player_, { menuButton: this })
    this.hideThreshold_ = 0
    menu.contentEl().style.maxHeight = 'none'
    menu.contentEl().style.overflowX = 'hidden'
    this.items = this.createItems()
    if (this.items) for (let i = 0; i < this.items.length; i++) menu.addItem(this.items[i])
    return menu
  }
}
