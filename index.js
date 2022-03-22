/*
	Looking at this code by curiosity ?
	Any suggestion you would like to add ?
	Please check out my GitHub
*/
process.setMaxListeners(0);

const EventEmitter = require('events');
const fs = require("fs");


const ApplyConfig = require("./ApplyConfig.js");
const defaultValues = require("./DefaultValues.json")["ui"];

const SocketManager = require("./SocketManager.js");

const Button = require("./Components/Button.js");
const Label = require("./Components/Label.js");
const TextBox = require("./Components/TextBox.js");
const PictureBox = require("./Components/PictureBox.js");
const CheckBox = require("./Components/CheckBox.js");


class NodeUI extends EventEmitter
{
	#config;

	constructor(uiConfig = {})
	{
		super()


		this.Button = this.button;
		this.Label = this.label;
		this.TextBox = this.textBox;
		this.PictureBox = this.pictureBox;
		this.CheckBox = this.checkBox;

		this.#config = {
			socket: null, // Socket configuration
			socketClient: null, // Main client socket communication
			socketPort: null, // Default communication between C# & NodeJS
		    socketPassword: Math.random().toString(36).slice(2).toString(), // Restrict access with a password to avoid any intrusion
			tag: Math.random().toString(36).slice(2).toString(),

			title: "NodeUI"
		}

		this.#config = Object.assign({}, this.#config, uiConfig)
		SocketManager.init(this, this.#config);
		this.#applyConfig(this.#config);

		this.on('move', function(x, y) {
			this.#config.x = x;
			this.#config.y = y;
		});
		
		this.on('resize', function(width, height) {
			this.#config.width = width;
			this.#config.height = height;
		});		
		

		var {exec} = require('child_process');
		// exec(`"${__dirname}\\NodeUI.exe" ${this.#config.socketPort} "${this.#config.socketPassword}"`);
	};


	get tag() {return this.#config.tag}
	
	notify(notification){this.#applyConfig({notify: notification }) }
	eval(evalString) {this.#applyConfig({evalString: evalString })}

	get visible() {return this.#getValue("visible")}
	set visible(visible) {this.#applyConfig({visible: visible})}

	get consoleVisible() {return this.#getValue("consoleVisible")}
	set consoleVisible(consoleVisible) {this.#applyConfig({consoleVisible: consoleVisible})}

	get title() {return this.#getValue("title")}
	set title(title) {this.#applyConfig({title: title})}

	get closed() {return this.#getValue("closed")}
	close() {this.#applyConfig({close: true})}

	get foreColor() {return this.#getValue("foreColor")}
	set foreColor(foreColor) {this.#applyConfig({foreColor: foreColor})}

	get backColor() {return this.#getValue("backColor")}
	set backColor(backColor) {this.#applyConfig({backColor: backColor})}

	get enabled() {return this.#getValue("enabled")}
	set enabled(enabled) {this.#applyConfig({enabled: enabled})}

	get backImage() {return this.#getValue("backImage")}
	set backImage(backImage) {this.#applyConfig({backImage: backImage})}

	get topMost() {return this.#getValue("topMost")}
	set topMost(topMost) {this.#applyConfig({topMost: topMost})}

	get x() { return this.#getValue("x")}
	set x(xPos) { this.#applyConfig({ x: xPos }) }

	get y() { return this.#getValue("y")}
	set y(yPos) { this.#applyConfig({ y: yPos }) }; 

	get width() {return this.#getValue("width")}
	set width(width) {this.#applyConfig({width: width})}

	get height() {return this.#getValue("height")}
	set height(height) {this.#applyConfig({height: height})}

	get icon() {return this.#getValue("icon")}
	set icon(icon) {this.#applyConfig({icon: icon})}



	button(buttonConfig = {}) {
		var newButton = new Button(buttonConfig, this.#config);
		SocketManager.events.push(newButton);
		return newButton;
	}

	label(labelConfig = {}) {
		var newLabel = new Label(labelConfig, this.#config);
		SocketManager.events.push(newLabel);
		return newLabel;
	}

	textBox(textBoxConfig = {}) {
		var newTextBox = new TextBox(textBoxConfig, this.#config);
		SocketManager.events.push(newTextBox);
		return newTextBox;
	}

	pictureBox(pictureBoxConfig = {}) {
		var newPictureBox = new PictureBox(pictureBoxConfig, this.#config);
		SocketManager.events.push(newPictureBox);
		return newPictureBox;
	}

	checkBox(checkBoxConfig = {}) {
		var newCheckBox = new CheckBox(checkBoxConfig, this.#config);
		SocketManager.events.push(newCheckBox);
		return newCheckBox;
	}

	#getValue(configKey) {
		if (this.#config.hasOwnProperty(configKey))
			return this.#config[configKey];
		else
			return defaultValues[configKey];
	}

	#applyConfig(configAttribs) { ApplyConfig(configAttribs, this.#config, defaultValues, this.#config.packetQueue, this); }
	/*
		#applyConfig(configAttrib)
		{
			for (var [confElemKey, confElemValue] of Object.entries(configAttrib))
			{
				var getProprety = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), confElemKey);
				if (getProprety && getProprety.set)
				{
					if (typeof(defaultValues[confElemKey]) !== typeof(confElemValue))
						return console.log(new Error(`Setting ${confElemKey} is expected to be of type '${typeof(defaultValues[confElemKey])}'. Got type ${typeof(confElemValue)}.`).stack);

					switch (confElemKey) 
					{
						case 'evalString':
							if (typeof(confElemValue) !== 'string') 
							var base64EvalString = Buffer.from(confElemValue, 'utf-8').toString('base64');
							this.#config.packetQueue.push(`ui|evalString|${base64EvalString}`);
						break;

						case 'consoleVisible':
							if (confElemValue === true) Console.Show();
							else Console.Hide();
						break;

						case 'socketPassword': break;
						case 'socketPort': break;

						case 'visible':
							this.#config.packetQueue.push(`ui|visible|${confElemValue}`);
						break;

						case 'title':
							this.#config.packetQueue.push(`ui|title|${confElemValue}`);
						break;

						case 'foreColor':
							if (!/^#[0-9A-F]{6}|#FF000000$/i.test(confElemValue)) return console.log(new Error(`Setting ${confElemKey} is expecting a HEX color such as #FF0000`).stack)
							this.#config.packetQueue.push(`ui|foreColor|${confElemValue}`);
						break;

						case 'backColor':
							if (!/^#[0-9A-F]{6}|#FF000000$$/i.test(confElemValue)) return console.log(new Error(`Setting ${confElemKey} is expecting a HEX color such as #FF0000`).stack)
							this.#config.packetQueue.push(`ui|backColor|${confElemValue}`);
						break;

						case 'enabled':
							this.#config.packetQueue.push(`ui|enabled|${confElemValue}`);
						break;
					
						case 'close': this.#config.packetQueue.push(`ui|close`); break;

						case 'width': this.#config.packetQueue.push(`ui|width|${confElemValue}`); break;

						case 'height': this.#config.packetQueue.push(`ui|height|${confElemValue}`); break;
					
						case 'x': this.#config.packetQueue.push(`ui|xPos|${confElemValue}`); break;

						case 'y': this.#config.packetQueue.push(`ui|yPos|${confElemValue}`); break;

						case 'backImage':
							if (confElemValue === "") {  this.#config.packetQueue.push(`ui|backImage|`);  break;  }
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
							this.#config.packetQueue.push(`ui|backImage|${fullPath}`);
						break;

						case 'icon':
							if (confElemValue === "") { this.#config.packetQueue.push(`ui|icon|`); break; }
							if (typeof(confElemValue) !== 'string') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'string'. Got type ${typeof(confElemValue)}.`).stack);	
							var fullPath = null;
							var icon = confElemValue;
							var appPath = process.argv[1].split("\\");
							appPath.pop();
							appPath = appPath.join("\\") + "\\";
							icon = icon.replace("./", "");
							if (fs.existsSync(appPath + icon))  fullPath = appPath + icon;
							else if (fs.existsSync(icon))  fullPath = icon;
							if (fullPath === null) return console.log(new Error(`Setting ${confElemKey} is not a valid path.`).stack)
							this.#config.packetQueue.push(`ui|icon|${fullPath}`);
						break;

						case 'topMost': this.#config.packetQueue.push(`ui|topMost|${confElemValue}`); break;

						case 'notify': this.#config.packetQueue.push(`ui|notify|${confElemValue}`); break;
					}
				}
			}
		}
	*/
}
module.exports = NodeUI;