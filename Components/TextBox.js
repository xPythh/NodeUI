const ApplyConfig = require("../ApplyConfig.js");
const defaultValues = require("../DefaultValues.json")["textbox"];

const EventEmitter = require('events');

module.exports = class extends EventEmitter 
{
	
	#config;
	#textBoxConfig;
	#configInstalled = false;
	constructor(newTextBoxConfig = {}, uiConfig = {})
	{
		super()

		this.#config = uiConfig; // UI Config Itself
		this.#textBoxConfig = { // TextBox Config
			tag: Math.random().toString(36).slice(2).toString(),
		};

		this.#textBoxConfig = Object.assign({}, this.#textBoxConfig, newTextBoxConfig)
		this.#config.packetQueue.push(`add|textBox|${this.tag}`)
		this.#applyConfig(this.#textBoxConfig);
		this.#config.packetQueue.push(`update|checkConfig|${this.tag}`)

		this.on('textChange', (changedText) => {
			this.#textBoxConfig.text = changedText; 
		});
	}


	get parent() { return this.#getValue("parent")}
	get tag() { return this.#textBoxConfig.tag}	

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

	get foreColor() { return this.#getValue(foreColor)}
	set foreColor(foreColor) { this.#applyConfig({ foreColor: foreColor}) }

	get backColor() { return this.#getValue(backColor)}
	set backColor(backColor) { this.#applyConfig({ backColor: backColor}) }

	get font() { return this.getValue("font")}
	set font(font) { this.#applyConfig({ font: font}) }

	bringToFront() { this.#applyConfig({ bringToFront: true }) }

	#getValue(configKey) {
		if (this.#config.hasOwnProperty(configKey))
			return this.#textBoxConfig[configKey];
		else
			return defaultValues[configKey];
	}

	#applyConfig(configAttribs) { ApplyConfig(configAttribs, this.#textBoxConfig, defaultValues, this.#config.packetQueue, this); }

}