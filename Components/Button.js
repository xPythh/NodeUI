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
	/*
		#applyConfig(configAttrib)
		{
			if (this.#buttonConfig.deleted) return console.log(new Error(`Setting cannot be attributed to deleted element.`).stack);
			if (configAttrib instanceof Array)
				return console.log(new Error(`Setting cannot be attributed with arrays.`).stack);

			for (var [confElemKey, confElemValue] of Object.entries(configAttrib))
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
						this.#buttonConfig.deleted = true;
					break;

					case 'foreColor':
						if (typeof(confElemValue) !== 'string') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'string'. Got type ${typeof(confElemValue)}.`).stack);	
						if (!/^#[0-9A-F]{6}$/i.test(confElemValue)) return console.log(new Error(`Setting ${confElemKey} is expecting a HEX color such as #FF0000`).stack)
						this.#config.packetQueue.push(`update|foreColor|${this.tag}|${confElemValue}`);
					break;

					case 'backColor':
						if (typeof(confElemValue) !== 'string') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'string'. Got type ${typeof(confElemValue)}.`).stack);	
						if (!/^#[0-9A-F]{6}$/i.test(confElemValue)) return console.log(new Error(`Setting ${confElemKey} is expecting a HEX color such as #FF0000`).stack)
						this.#config.packetQueue.push(`update|backColor|${this.tag}|${confElemValue}`);
					break;

					case 'backImage':
						if (confElemValue === null) {  this.#config.packetQueue.push(`update|backImage|${this.tag}|`);  break;  }
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
						this.#config.packetQueue.push(`update|backImage|${this.tag}|${fullPath}`);
					break;

					case 'enabled':
						if (typeof(confElemValue) !== 'boolean') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'boolean'. Got type ${typeof(confElemValue)}.`).stack);
						this.#config.packetQueue.push(`update|enabled|${this.tag}|${confElemValue}`);
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
				var getProprety = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), confElemKey);
				if (getProprety && getProprety.set)
					this.#config[confElemKey] = confElemValue
			}
		}
	*/
}


