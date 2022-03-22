const ApplyConfig = require("../ApplyConfig.js");
const defaultValues = require("../DefaultValues.json")["button"];

const EventEmitter = require('events');

module.exports = class extends EventEmitter 
{
	
	#config;
	#buttonConfig;
	#configInstalled = false;
	constructor(newButtonConfig = {}, uiConfig = {})
	{
		super()

		this.#config = uiConfig; // UI Config Itself
		this.#buttonConfig = { // Button Config
			tag: Math.random().toString(36).slice(2).toString(),
		};

		this.#buttonConfig = Object.assign({}, this.#buttonConfig, newButtonConfig)
		this.#config.packetQueue.push(`add|button|${this.tag}`)
		this.#applyConfig(this.#buttonConfig);
		this.#config.packetQueue.push(`update|checkConfig|${this.tag}`)

	}



	get parent() { return this.#getValue("parent")}
	get tag() { return this.#buttonConfig.tag}	

	get text() { return this.#getValue("text")}
	set text(text) { this.#applyConfig({ text: text }) }
	
	get x() { return this.#getValue("x")}
	set x(xPos) { this.#applyConfig({ x: xPos }) }

	get y() { return this.#getValue("y")}
	set y(yPos) { this.#applyConfig({ y: yPos }) }; 

	get width() { return this.#getValue("width")}
	set width(width) { this.#applyConfig({ width: width }) }

	get height() { return this.#getValue("height")}
	set height(height) { this.#applyConfig({ height: height }) }; 

	get visible() { return this.#getValue("visible")}
	set visible(visible) { this.#applyConfig({ visible: visible }) }

	get deleted() { return this.#getValue("deleted")}
	delete() { this.#applyConfig({ delete: true }) }

	get backImage() {return this.#getValue("backImage")}
	set backImage(backImage) {this.#applyConfig({backImage: backImage})}

	get foreColor() { return this.#getValue("foreColor")}
	set foreColor(foreColor) { this.#applyConfig({ foreColor: foreColor}) }

	get backColor() { return this.#getValue("backColor")}
	set backColor(backColor) { this.#applyConfig({ backColor: backColor}) }

	get enabled() { return this.#getValue("enabled")}
	set enabled(enabled) { this.#applyConfig({ enabled: enabled}) }

	bringToFront() { this.#config.packetQueue.push(`update|bringToFront|${this.tag}`); }

	#getValue(configKey) {
		if (this.#config.hasOwnProperty(configKey))
			return this.#buttonConfig[configKey];
		else
			return defaultValues[configKey];
	}

	#applyConfig(configAttribs) { ApplyConfig(configAttribs, this.#buttonConfig, defaultValues, this.#config.packetQueue, this); }

}