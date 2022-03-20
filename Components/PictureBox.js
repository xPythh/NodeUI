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
			text: 'PictureBox',
			tag: Math.random().toString(36).slice(2).toString(),

			x: 4,
			y: 4,
			width: 160,
			height: 50,
			parent: {},
			visible: true,
			deleted: false,
		    backColor: "#FF000000",
		    image: null
		};

		this.#pictureBoxConfig = Object.assign({}, this.#pictureBoxConfig, newPictureBoxConfig)
		this.#config.socketClient.packetQueue.push(`add|pictureBox|${this.tag}`)
		this.#applyConfig(this.#pictureBoxConfig);
		this.#config.socketClient.packetQueue.push(`update|checkConfig|${this.tag}`)
	}

	get parent() { return this.#pictureBoxConfig.parent }
	get tag() { return this.#pictureBoxConfig.tag }	

	get x() { return this.#pictureBoxConfig.xPos }
	set x(xPos) { this.#applyConfig({ x: xPos }) }

	get y() { return this.#pictureBoxConfig.y }
	set y(yPos) { this.#applyConfig({ y: yPos }) }; 

	get width() { return this.#pictureBoxConfig.width }
	set width(width) { this.#applyConfig({ width: width }) }

	get height() { return this.#pictureBoxConfig.height }
	set height(height) { this.#applyConfig({ height: height }) }; 

	get height() { return this.#pictureBoxConfig.height }
	set height(height) { this.#applyConfig({ height: height }) }; 

	get visible() { return this.#pictureBoxConfig.visible }
	set visible(visible) { this.#applyConfig({ visible: visible }) }

	get deleted() { return this.#pictureBoxConfig.deleted }
	delete() { this.#applyConfig({ delete: true }) }

	get backColor() { return this.#pictureBoxConfig.backColor }
	set backColor(backColor) { this.#applyConfig({ backColor: backColor}) }

	get image() { return this.#pictureBoxConfig.image }
	set image(image) { this.#applyConfig({ image: image}) }

	bringToFront() { this.#applyConfig({ bringToFront: true }) }

	#applyConfig(configAttrib)
	{
		if (this.#pictureBoxConfig.deleted) return console.log(new Error(`Setting cannot be attributed to deleted element.`).stack);
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

					case 'x':
						if (typeof(confElemValue) !== 'number') return console.log(new Error(`Setting ${xPos} is expected to be of type 'number'. Got type ${typeof(confElemValue)}.`).stack);
						this.#config.socketClient.packetQueue.push(`update|xPos|${this.tag}|${confElemValue}`);
					break;

					case 'y':
						if (typeof(confElemValue) !== 'number') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'number'. Got type ${typeof(confElemValue)}.`).stack);
						this.#config.socketClient.packetQueue.push(`update|yPos|${this.tag}|${confElemValue}`);
					break;

					case 'visible':
						if (typeof(confElemValue) !== 'boolean') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'bool'. Got type ${typeof(confElemValue)}.`).stack);	
						this.#config.socketClient.packetQueue.push(`update|visible|${this.tag}|${confElemValue}`);	
					break;

					case 'delete':
						if (typeof(confElemValue) !== 'boolean') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'bool'. Got type ${typeof(confElemValue)}.`).stack);	
						this.#config.socketClient.packetQueue.push(`delete|${this.tag}`);
						this.#pictureBoxConfig.deleted = true;
					break;

					case 'backColor':
						if (typeof(confElemValue) !== 'string') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'string'. Got type ${typeof(confElemValue)}.`).stack);	
						if (!/^#[0-9A-F]{6}|#FF000000$$/i.test(confElemValue)) return console.log(new Error(`Setting ${confElemKey} is expecting a HEX color such as #FF0000`).stack)
						this.#config.socketClient.packetQueue.push(`update|backColor|${this.tag}|${confElemValue}`);
					break;

					case 'width':
						if (typeof(confElemValue) !== 'number') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'number'. Got type ${typeof(confElemValue)}.`).stack);
						this.#config.socketClient.packetQueue.push(`update|width|${this.tag}|${confElemValue}`);
					break;

					case 'height':
						if (typeof(confElemValue) !== 'number') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'number'. Got type ${typeof(confElemValue)}.`).stack);
						this.#config.socketClient.packetQueue.push(`update|height|${this.tag}|${confElemValue}`);
					break;

					case 'image':
						if (confElemValue === null) {  this.#config.socketClient.packetQueue.push(`update|image|${this.tag}|`);  break;  }
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
						this.#config.socketClient.packetQueue.push(`update|image|${this.tag}|${fullPath}`);
					break;

					case 'bringToFront':
						this.#config.socketClient.packetQueue.push(`update|bringToFront|${this.tag}`);
					break;
				}
				this.#pictureBoxConfig[confElemKey] = confElemValue
			}
	}
}


