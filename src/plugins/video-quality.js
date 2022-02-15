(function () {
    'use strict'
    let videojs = null
    if (typeof window.videojs === 'undefined' && typeof require === 'function') {
        videojs = require('video.js').default
    } else {
        videojs = window.videojs
    }

    (function (window, videojs) {
        const currentItem = {}

        const _MenuItem = videojs.getComponent('MenuItem')
        const QualityabcdItem = videojs.extend(_MenuItem, {
            constructor (player, options) {
                var _this
                options.selected = options.val === currentItem.val
                options.selectable = true
                _this = _MenuItem.call(this, player, options) || this
                _this.label = options.label
                _this.val = options.val

                player.on('qualityChange', videojs.bind(_this, _this.update))
            },
            handleClick (event) {
                _MenuItem.prototype.handleClick.call(this, event)
                currentItem.label = this.options_.label
                currentItem.val = this.options_.val
                this.player_.quality = currentItem
                this.player_.trigger('qualityChange')
                this.player_.trigger('updateLabel')
            },
            update () {
                this.selected(this.options_.val === currentItem.val)
            }
        })

        const _MenuButton = videojs.getComponent('MenuButton')
        const _Menu = videojs.getComponent('Menu')
        const qualityButton = videojs.extend(_MenuButton, {
            constructor (player, options) {
                this.opt = options.playerOptions
                currentItem.label = this.opt.qualityType[this.opt.quality.br]
                currentItem.val = this.opt.quality.br
                _MenuButton.call(this, player, currentItem)

                player.on('updateLabel', videojs.bind(this, this.updateLabel))
            },
            createEl () {
                const el = _MenuButton.prototype.createEl.call(this)

                this.labelEl_ = videojs.createEl('div', {
                    className: 'vjs-quality-value',
                    innerHTML: this.opt.qualityType[this.opt.quality.br]
                })
                el.appendChild(this.labelEl_)
                return el
            },
            createMenu () {
                const menu = new _Menu(this.player())
                const qualityList = this.opt.qualityList

                if (qualityList.length) {
                    // 有可能返回的分辨率顺序不对
                    qualityList.sort(function (a, b) { return a.br - b.br })
                    for (var i = qualityList.length - 1; i >= 0; i--) {
                        menu.addChild(new QualityabcdItem(this.player(), {
                            label: this.opt.qualityType[qualityList[i].br],
                            val: qualityList[i].br
                        }))
                    }
                }

                return menu
            },
            updateLabel () {
                this.labelEl_.innerHTML = currentItem.label
            },
            buildWrapperCSSClass () {
                return 'vjs-quality ' + _MenuButton.prototype.buildWrapperCSSClass.call(this)
            }
        })

        videojs.registerComponent('qualityButton', qualityButton)
    })(window, videojs)
})()
