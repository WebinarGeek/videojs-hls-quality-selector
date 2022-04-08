# videojs-hls-quality-selector

Adds a quality selector menu for HLS sources played in videojs.  
Requires `videojs-contrib-quality-levels` plugins.  
Any HLS manifest with multiple playlists/renditions should be selectable from within the added control.

**Native HLS**

Does not yet support browsers using native HLS (Safari, Edge, etc).  
To enable plugin in browsers with native HLS, you must force non-native HLS playback:

## Options

The main function `hlsQualitySelector()` accepts an object with the following values:

**displayQuality** `boolean` - _false_

Set to true to display the currently selected resolution in the menu button.
When not enabled, displayed an included VJS "HD" icon.

**placementIndex** `integer`

Set this to override the default positioning of the menu button in the control bar,
and position it relative to the other components in the control bar.

**vjsIconClass** `string` - _"vjs-icon-hd"_

Set this to one of the [custom VJS icons](https://videojs.github.io/font/) to override the icon for the menu button.


## Methods

**getQuality** `{name?: string, bitrate: number, height?: number}`

Return the quality and info of the currently selected stream.

**setQuality** `{name?: string, bitrate?: number, height?: number}`

Set the quality to a stream based on name, bitrate and/or height.
The criteria will be used to filter the available sources and switch to the first matching one.

## Installation

```sh
npm install git+https://github.com/WebinarGeek/videojs-hls-quality-selector.git
```

## Usage

To include videojs-hls-quality-selector on your website or web application, use any of the following methods.

### `<script>` tag

You need to load the webpack parsed plain js file from the dist folder for this.
Include the plugin _after_ you include [video.js](https://videojs.com).
Both plugins will register themselves and be useable right away.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-contrib-quality-levels.min.js"></script>
<script src="dist/videojs-hls-quality-selector.min.js"></script>
<script>
  const player = videojs('my-video')
  player.hlsQualitySelector()
</script>
```

### ES modules

When using ES modules, install videojs-hls-quality-selector via npm,
then `import` the plugin as you would any other module.

```js
import videojs from 'videojs'
import qualityLevels from 'videojs-contrib-quality-levels'
import hlsQualitySelector from 'videojs-hls-quality-selector'
const player = videojs('my-video')
if (!videojs.getPlugin('qualityLevels')) videojs.registerPlugin('qualityLevels', qualityLevels)
if (!videojs.getPlugin('hlsQualitySelector')) videojs.registerPlugin('hlsQualitySelector', hlsQualitySelector)
player.hlsQualitySelector()
```

### CommonJS

When using CommonJS, install videojs-hls-quality-selector via npm,
then `require` the plugin as you would any other module.

```js
const videojs = require('video.js')
const qualityLevels = require('qualityLevels')
const hlsQualitySelector = require('videojs-hls-quality-selector')
const player = videojs('my-video')
if (!videojs.getPlugin('qualityLevels')) videojs.registerPlugin('qualityLevels', qualityLevels)
if (!videojs.getPlugin('hlsQualitySelector')) videojs.registerPlugin('hlsQualitySelector', hlsQualitySelector)
player.hlsQualitySelector()
```

## License

The MIT License

Copyright (c) 2022-2022 WebinarGeek
Copyright (c) 2017-2021 Chris Boustead (chris@forgemotion.com)
