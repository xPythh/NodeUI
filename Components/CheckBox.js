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
	/*
		#applyConfig(configAttrib)
		{
				if (this.#checkBoxConfig.deleted) return console.log(new Error(`Setting cannot be attributed to deleted element.`).stack);
				if (configAttrib instanceof Array)
					return console.log(new Error(`Setting cannot be attributed with arrays.`).stack);

				for (var [confElemKey, confElemValue] of Object.entries(configAttrib))
				{	
					switch (confElemKey) 
					{
						case 'checked':
							if (typeof(confElemValue) !== 'boolean') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'boolean'. Got type ${typeof(confElemValue)}.`).stack);
							this.#config.packetQueue.push(`update|checkState|${this.tag}|${confElemValue}`);
						break;

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
							this.#checkBoxConfig.deleted = true;
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

						case 'enabled':
							if (typeof(confElemValue) !== 'boolean') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'boolean'. Got type ${typeof(confElemValue)}.`).stack);
							console.log("ENABLED : " + confElemValue)
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


