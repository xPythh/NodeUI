const EventEmitter = require('events');
const fs = require("fs");

module.exports = class extends EventEmitter 
{
	
	#config;
	#labelConfig;
	#configInstalled = false;
	constructor(newLabelConfig = {}, uiConfig = {})
	{
		super()

		this.#config = uiConfig; // UI Config Itself
		this.#labelConfig = { // Label Config
			text: 'Label',
			tag: Math.random().toString(36).slice(2).toString(),

			x: 0,
			y: 0,
			width: 120,
			height: 22,
			parent: {},

			visible: true,
			deleted: false,

		    foreColor: "#000000",
		};

		this.#labelConfig = Object.assign({}, this.#labelConfig, newLabelConfig)
		this.#config.packetQueue.push(`add|label|${this.tag}`)
		this.#applyConfig(this.#labelConfig);
		this.#config.packetQueue.push(`update|checkConfig|${this.tag}`)

	}


	get parent() { return this.#labelConfig.parent }
	get tag() { return this.#labelConfig.tag }	

	get text() { return this.#labelConfig.text; }
	set text(text) { this.#applyConfig({ text: text }) }
	
	get x() { return this.#labelConfig.xPos }
	set x(xPos) { this.#applyConfig({ x: xPos }) }

	get y() { return this.#labelConfig.y }
	set y(yPos) { this.#applyConfig({ y: yPos }) }; 

	get width() { return this.#labelConfig.width }
	set width(width) { this.#applyConfig({ width: width }) }

	get height() { return this.#labelConfig.height }
	set height(height) { this.#applyConfig({ height: height }) }; 

	get visible() { return this.#labelConfig.visible }
	set visible(visible) { this.#applyConfig({ visible: visible }) }

	get deleted() { return this.#labelConfig.deleted }
	delete() { this.#applyConfig({ delete: true }) }

	get foreColor() { return this.#labelConfig.foreColor }
	set foreColor(foreColor) { this.#applyConfig({ foreColor: foreColor}) }

	get backColor() { return this.#labelConfig.backColor }
	set backColor(backColor) { this.#applyConfig({ backColor: backColor}) }

	bringToFront() { this.#applyConfig({ bringToFront: true }) }

	#applyConfig(configAttrib)
	{
		if (this.#labelConfig.deleted) return console.log(new Error(`Setting cannot be attributed to deleted element.`).stack);
		if (configAttrib instanceof Array)
			return console.log(new Error(`Setting cannot be attributed with arrays.`).stack);

		if (typeof(configAttrib) === "object")
			for (const [confElemKey, confElemValue] of Object.entries(configAttrib))
			{	
				switch (confElemKey) 
				{
					case 'parent':
						if (typeof(confElemValue) !== 'object') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'object'. Got type ${typeof(confElemValue)}.`).stack);
					break;

					case 'text':
						if (typeof(confElemValue) !== 'string') return console.log(new Error(`Setting ${confElemValue} is expected to be of type 'string'. Got type ${typeof(confElemValue)}.`).stack);
						this.#config.packetQueue.push(`update|text|${this.tag}|${confElemValue}`);
					break;

					case 'x':
						if (typeof(confElemValue) !== 'number') return console.log(new Error(`Setting ${xPos} is expected to be of type 'number'. Got type ${typeof(confElemValue)}.`).stack);
						this.#config.packetQueue.push(`update|xPos|${this.tag}|${confElemValue}`);
					break;

					case 'y':
						if (typeof(confElemValue) !== 'number') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'number'. Got type ${typeof(confElemValue)}.`).stack);
						this.#config.packetQueue.push(`update|yPos|${this.tag}|${confElemValue}`);
					break;

					case 'visible':
						if (typeof(confElemValue) !== 'boolean') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'bool'. Got type ${typeof(confElemValue)}.`).stack);	
						this.#config.packetQueue.push(`update|visible|${this.tag}|${confElemValue}`);	
					break;

					case 'delete':
						if (typeof(confElemValue) !== 'boolean') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'bool'. Got type ${typeof(confElemValue)}.`).stack);	
						this.#config.packetQueue.push(`delete|${this.tag}`);
						this.#labelConfig.deleted = true;
					break;

					case 'foreColor':
						if (typeof(confElemValue) !== 'string') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'string'. Got type ${typeof(confElemValue)}.`).stack);	
						if (!/^#[0-9A-F]{6}|#00FFFFFF$/i.test(confElemValue)) return console.log(new Error(`Setting ${confElemKey} is expecting a HEX color such as #FF0000`).stack)
						this.#config.packetQueue.push(`update|foreColor|${this.tag}|${confElemValue}`);
					break;

					case 'backColor':
						if (typeof(confElemValue) !== 'string') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'string'. Got type ${typeof(confElemValue)}.`).stack);	
						if (!/^#[0-9A-F]{6}|#FF000000$$/i.test(confElemValue)) return console.log(new Error(`Setting ${confElemKey} is expecting a HEX color such as #FF0000`).stack)
						this.#config.packetQueue.push(`update|backColor|${this.tag}|${confElemValue}`);
					break;

					case 'width':
						if (typeof(confElemValue) !== 'number') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'number'. Got type ${typeof(confElemValue)}.`).stack);
						this.#config.packetQueue.push(`update|width|${this.tag}|${confElemValue}`);
					break;

					case 'height':
						if (typeof(confElemValue) !== 'number') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'number'. Got type ${typeof(confElemValue)}.`).stack);
						this.#config.packetQueue.push(`update|height|${this.tag}|${confElemValue}`);
					break;

					case 'bringToFront':
						this.#config.packetQueue.push(`update|bringToFront|${this.tag}`);
					break;
				}
				this.#labelConfig[confElemKey] = confElemValue
			}
	}
}


