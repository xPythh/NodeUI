const ApplyConfig = require("../ApplyConfig.js");
const defaultValues = require("../DefaultValues.json")["checkbox"];

const EventEmitter = require('events');

module.exports = class extends EventEmitter 
{
	
	#config;
	#checkBoxConfig;
	#configInstalled = false;
	constructor(newCheckBoxConfig = {}, uiConfig = {})
	{
		super()

		this.#config = uiConfig; // UI Config Itself
		this.#checkBoxConfig = { // CheckBox Config
			tag: Math.random().toString(36).slice(2).toString(),

			text: "CheckBox",
		};

		this.#checkBoxConfig = Object.assign({}, this.#checkBoxConfig, newCheckBoxConfig)
		this.#config.packetQueue.push(`add|checkBox|${this.tag}`)
		this.#applyConfig(this.#checkBoxConfig);
		this.#config.packetQueue.push(`update|checkConfig|${this.tag}`)

		this.on('checkChanged', (checked) => {
			this.#checkBoxConfig.checked = checked; 
		});
	}


	get parent() { return this.#getValue("parent")}
	get tag() { return this.#checkBoxConfig.tag }

	get text() { return this.#getValue("text")}
	set text(text) { this.#applyConfig({ text: text }) }

	get checked() { return this.#getValue("checked")}
	set checked(checked) { this.#applyConfig({ checked: checked }) }

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

	get enabled() { return this.#getValue("enabled")}
	set enabled(enabled) { this.#applyConfig({ enabled: enabled}) }

	bringToFront() { this.#applyConfig({ bringToFront: true }) }

	#getValue(configKey) {
		if (this.#config.hasOwnProperty(configKey))
			return this.#checkBoxConfig[configKey];
		else
			return defaultValues[configKey];
	}

	#applyConfig(configAttribs) { ApplyConfig(configAttribs, this.#checkBoxConfig, defaultValues, this.#config.packetQueue, this); }

}