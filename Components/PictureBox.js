const defaultValues = require("../DefaultValues.json")["picturebox"];

const EventEmitter = require('events');
const fs = require("fs");

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

			text: 'PictureBox',
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

	#applyConfig(configAttrib)
	{
		if (this.#pictureBoxConfig.deleted) return console.log(new Error(`Setting cannot be attributed to deleted element.`).stack);
		if (configAttrib instanceof Array)
			return console.log(new Error(`Setting cannot be attributed with arrays.`).stack);

		for (var [confElemKey, confElemValue] of Object.entries(configAttrib))
		{	
			switch (confElemKey) 
			{
				case 'parent':
					if (typeof(confElemValue) !== 'object') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'object'. Got type ${typeof(confElemValue)}.`).stack);
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
					this.#pictureBoxConfig.deleted = true;
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

				case 'image':
					if (confElemValue === null) {  this.#config.packetQueue.push(`update|image|${this.tag}|`);  break;  }
					if (typeof(confElemValue) !== 'string') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'string'. Got type ${typeof(confElemValue)}.`).stack);	
					var fullPath = null;
					var backImage = confElemValue;
					var appPath = process.argv[1].split("\\");
					appPath.pop();
					appPath = appPath.join("\\") + "\\";
					backImage = backImage.replace("./", "");
					if (fs.existsSync(appPath + backImage))  fullPath = appPath + backImage;
					else if (fs.existsSync(backImage))  fullPath = backImage;
					if (fullPath === null) return console.log(new Error(`Setting ${confElemKey} is not a valid path.`).stack)
					this.#config.packetQueue.push(`update|image|${this.tag}|${fullPath}`);
				break;

				case 'bringToFront':
					this.#config.packetQueue.push(`update|bringToFront|${this.tag}`);
				break;
			}
			var getProprety = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), confElemKey);
			if (getProprety && getProprety.set)
				this.#config[confElemKey] = confElemValue
		}
	}
}


