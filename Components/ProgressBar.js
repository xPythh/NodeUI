const ApplyConfig = require("../ApplyConfig.js");
const defaultValues = require("../DefaultValues.json")["progressbar"];

const EventEmitter = require('events');

module.exports = class extends EventEmitter 
{
	
	#config;
	#progressBarConfig;
	#configInstalled = false;
	constructor(newProgressBarConfig = {}, uiConfig = {})
	{
		super()

		this.#config = uiConfig; // UI Config Itself
		this.#progressBarConfig = { // Button Config
			tag: Math.random().toString(36).slice(2).toString(),
		};

		this.#progressBarConfig = Object.assign({}, this.#progressBarConfig, newProgressBarConfig)
		this.#config.packetQueue.push(`add|progressBar|${this.tag}`)
		this.#applyConfig(this.#progressBarConfig);
		this.#config.packetQueue.push(`update|checkConfig|${this.tag}`)

	}



	get parent() { return this.#getValue("parent")}
	get tag() { return this.#progressBarConfig.tag}	
	
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

	get enabled() { return this.#getValue("enabled")}
	set enabled(enabled) { this.#applyConfig({ enabled: enabled}) }

	get value() { return this.#getValue("value")}
	set value(value) { this.#applyConfig({ value: value }) }

	bringToFront() { this.#config.packetQueue.push(`update|bringToFront|${this.tag}`); }

	#getValue(configKey) {
		if (this.#config.hasOwnProperty(configKey))
			return this.#progressBarConfig[configKey];
		else
			return defaultValues[configKey];
	}

	#applyConfig(configAttribs) { ApplyConfig(configAttribs, this.#progressBarConfig, defaultValues, this.#config.packetQueue, this); }

}