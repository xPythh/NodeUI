const ApplyConfig = require("../ApplyConfig.js");
const defaultValues = require("../DefaultValues.json")["label"];

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
			tag: Math.random().toString(36).slice(2).toString(),

			text: "Label"
		};

		this.#labelConfig = Object.assign({}, this.#labelConfig, newLabelConfig)

		this.#config.packetQueue.push(`add|label|${this.tag}`)
		this.#applyConfig(this.#labelConfig);
		this.#config.packetQueue.push(`update|checkConfig|${this.tag}`)
	}


	get parent() { return this.#getValue("parent") }
	get tag() { return this.#labelConfig.tag}	

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

	get foreColor() { return this.#getValue("foreColor")}
	set foreColor(foreColor) { this.#applyConfig({ foreColor: foreColor}) }

	get backColor() { return this.#getValue("backColor")}
	set backColor(backColor) { this.#applyConfig({ backColor: backColor}) }

	get font() { return this.getValue("font")}
	set font(font) { this.#applyConfig({ font: font}) }


	bringToFront() { this.#applyConfig({ bringToFront: true }) }

	#getValue(configKey) {
		if (this.#config.hasOwnProperty(configKey))
			return this.#labelConfig[configKey];
		else
			return defaultValues[configKey];
	}

	#applyConfig(configAttribs) { ApplyConfig(configAttribs, this.#labelConfig, defaultValues, this.#config.packetQueue, this); }

}