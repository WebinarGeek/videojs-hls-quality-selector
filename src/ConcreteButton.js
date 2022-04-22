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
    super(player, { name: 'QualityButton' })
  }

  createMenu() {
    const menu = new VideoJsMenuClass(this.player_, { menuButton: this })
    this.hideThreshold_ = 0
    menu.contentEl().style.maxHeight = 'none'
    menu.contentEl().style.overflowX = 'hidden'
    menu.el().style.width = '12em'
    menu.el().style.left = '-4em'
    if (this.items) for (let i = 0; i < this.items.length; i++) menu.addItem(this.items[i])
    return menu
  }
}
