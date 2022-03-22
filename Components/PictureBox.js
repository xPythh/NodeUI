const ApplyConfig = require("../ApplyConfig.js");
const defaultValues = require("../DefaultValues.json")["picturebox"];

const EventEmitter = require('events');

module.exports = class extends EventEmitter 
{
	
	#config;
	#pictureBoxConfig;
	#configInstalled = false;
	constructor(newPictureBoxConfig = {}, uiConfig = {})
	{
		super()

		this.#config = uiConfig; // UI Config Itself
		this.#pictureBoxConfig = { // PictureBox Config
			tag: Math.random().toString(36).slice(2).toString(),
		};

		this.#pictureBoxConfig = Object.assign({}, this.#pictureBoxConfig, newPictureBoxConfig)
		this.#config.packetQueue.push(`add|pictureBox|${this.tag}`)
		this.#applyConfig(this.#pictureBoxConfig);
		this.#config.packetQueue.push(`update|checkConfig|${this.tag}`)
	}

	get parent() { return this.#getValue("parent")}
	get tag() { return this.#pictureBoxConfig.tag }	

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

	get backColor() { return this.#getValue("backColor")}
	set backColor(backColor) { this.#applyConfig({ backColor: backColor}) }

	get image() { return this.#getValue("image")}
	set image(image) { this.#applyConfig({ image: image}) }

	bringToFront() { this.#applyConfig({ bringToFront: true }) }

	#getValue(configKey) {
		if (this.#config.hasOwnProperty(configKey))
			return this.#pictureBoxConfig[configKey];
		else
			return defaultValues[configKey];
	}

	#applyConfig(configAttribs) { ApplyConfig(configAttribs, this.#pictureBoxConfig, defaultValues, this.#config.packetQueue, this); }
	
}