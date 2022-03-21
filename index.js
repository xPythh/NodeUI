/*
	Looking at this code by curiosity ?
	Any suggestion you would like to add ?
	Please check out my GitHub
*/
process.setMaxListeners(0);

const EventEmitter = require('events');
const fs = require("fs");


const Console = require("./ConsoleManager.js");
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
			
			title: "NodeUI",
			x: 50,
			y: 130,
			width:650,
			height:400,
			consoleVisible: true, // Hide console when script is starting
			visible: true,
			enabled: true,
		    closed: false,
		    hideUi: false,
		    foreColor: "#000000",
		    backColor: "#F0F0F0",
		    backImage: null,
		    icon: null,
		}

		this.#config = Object.assign({}, this.#config, uiConfig)
		SocketManager.init(this, this.#config);

		this.on('ready', () => 
		{
			SocketManager.events.push(this);
			this.#applyConfig(this.#config);
			
			this.on('move', function(x, y) {
				this.#config.x = x;
				this.#config.y = y;
			});

			this.on('resize', function(width, height) {
				this.#config.width = width;
				this.#config.height = height;
			});
		});


		var {exec} = require('child_process');
		exec(`"${__dirname}\\NodeUI.exe" ${this.#config.socketPort} "${this.#config.socketPassword}"`);
	};


	get tag() {return this.#config.tag}
	
	notify(notification){this.#applyConfig({notify: notification }) }
	eval(evalString) {this.#applyConfig({evalString: evalString })}

	get visible() {return this.#config.visible}
	set visible(visible) {this.#applyConfig({visible: visible})}

	get title() {return this.#config.title}
	set title(title) {this.#applyConfig({title: title})}

	get closed() {return this.#config.closed}
	close() {this.#applyConfig({close: true})}

	get foreColor() {return this.#config.foreColor}
	set foreColor(foreColor) {this.#applyConfig({foreColor: foreColor})}

	get backColor() {return this.#config.backColor}
	set backColor(backColor) {this.#applyConfig({backColor: backColor})}

	get enabled() {return this.#config.enabled}
	set enabled(enabled) {this.#applyConfig({enabled: enabled})}

	get backImage() {return this.#config.backImage}
	set backImage(backImage) {this.#applyConfig({backImage: backImage})}

	get topMost() {return this.#config.topMost}
	set topMost(topMost) {this.#applyConfig({topMost: topMost})}

	get x() { return this.#config.xPos }
	set x(xPos) { this.#applyConfig({ x: xPos }) }

	get y() { return this.#config.y }
	set y(yPos) { this.#applyConfig({ y: yPos }) }; 

	get width() {return this.#config.width}
	set width(width) {this.#applyConfig({width: width})}

	get height() {return this.#config.height}
	set height(height) {this.#applyConfig({height: height})}

	get icon() {return this.#config.icon}
	set icon(icon) {this.#applyConfig({icon: icon})}



	button(buttonConfig = {}) {
		if (!this.#config.socketClient)
			return console.log(Error(`UI has not been initialised yet.`).stack);

		var newButton = new Button(buttonConfig, this.#config);
		SocketManager.events.push(newButton);
		return newButton;
	}

	label(labelConfig = {}) {
		if (!this.#config.socketClient)
			return console.log(Error(`UI has not been initialised yet.`).stack);

		var newLabel = new Label(labelConfig, this.#config);
		SocketManager.events.push(newLabel);
		return newLabel;
	}

	textBox(textBoxConfig = {}) {
		if (!this.#config.socketClient)
			return console.log(Error(`UI has not been initialised yet.`).stack);

		var newTextBox = new TextBox(textBoxConfig, this.#config);
		SocketManager.events.push(newTextBox);
		return newTextBox;
	}

	pictureBox(pictureBoxConfig = {}) {
		if (!this.#config.socketClient)
			return console.log(Error(`UI has not been initialised yet.`).stack);

		var newPictureBox = new PictureBox(pictureBoxConfig, this.#config);
		SocketManager.events.push(newPictureBox);
		return newPictureBox;
	}

	checkBox(checkBoxConfig = {}) {
		if (!this.#config.socketClient)
			return console.log(Error(`UI has not been initialised yet.`).stack);

		var newCheckBox = new CheckBox(checkBoxConfig, this.#config);
		SocketManager.events.push(newCheckBox);
		return newCheckBox;
	}




	#applyConfig(configAttrib)
	{
		for (var [confElemKey, confElemValue] of Object.entries(configAttrib))
		{

			switch (confElemKey) 
			{
				case 'evalString':
					if (typeof(confElemValue) !== 'string') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'string'. Got type ${typeof(confElemValue)}.`).stack);
					var base64EvalString = Buffer.from(confElemValue, 'utf-8').toString('base64');
					this.#config.socketClient.packetQueue.push(`ui|evalString|${base64EvalString}`);
				break;

				case 'consoleVisible':
					if (typeof(confElemValue) !== 'boolean') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'boolean'. Got type ${typeof(confElemValue)}.`).stack);
					if (confElemValue === true) Console.Show();
					else Console.Hide();
				break;

				case 'socketPassword':
					if (typeof(confElemValue) !== 'string') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'string'. Got type ${typeof(confElemValue)}.`).stack);
				break;

				case 'socketPort':
					if (typeof(confElemValue) !== 'integer' && typeof(confElemValue) !== 'number') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'integer'. Got type ${typeof(confElemValue)}.`).stack);
				break;

				case 'visible':
					if (typeof(confElemValue) !== 'boolean') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'boolean'. Got type ${typeof(confElemValue)}.`).stack);
					this.#config.socketClient.packetQueue.push(`ui|visible|${confElemValue}`);
				break;

				case 'title':
					if (typeof(confElemValue) !== 'string') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'string'. Got type ${typeof(confElemValue)}.`).stack);
					this.#config.socketClient.packetQueue.push(`ui|title|${confElemValue}`);
				break;

				case 'foreColor':
					if (typeof(confElemValue) !== 'string') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'string'. Got type ${typeof(confElemValue)}.`).stack);	
					if (!/^#[0-9A-F]{6}|#FF000000$/i.test(confElemValue)) return console.log(new Error(`Setting ${confElemKey} is expecting a HEX color such as #FF0000`).stack)
					this.#config.socketClient.packetQueue.push(`ui|foreColor|${confElemValue}`);
				break;

				case 'backColor':
					if (typeof(confElemValue) !== 'string') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'string'. Got type ${typeof(confElemValue)}.`).stack);	
					if (!/^#[0-9A-F]{6}|#FF000000$$/i.test(confElemValue)) return console.log(new Error(`Setting ${confElemKey} is expecting a HEX color such as #FF0000`).stack)
					this.#config.socketClient.packetQueue.push(`ui|backColor|${confElemValue}`);
				break;

				case 'enabled':
					if (typeof(confElemValue) !== 'boolean') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'boolean'. Got type ${typeof(confElemValue)}.`).stack);
					this.#config.socketClient.packetQueue.push(`ui|enabled|${confElemValue}`);
				break;
			
				case 'close':
					if (typeof(confElemValue) !== 'boolean') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'boolean'. Got type ${typeof(confElemValue)}.`).stack);
					this.#config.socketClient.packetQueue.push(`ui|close`);
				break;

				case 'width':
					if (typeof(confElemValue) !== 'number') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'number'. Got type ${typeof(confElemValue)}.`).stack);
					this.#config.socketClient.packetQueue.push(`ui|width|${confElemValue}`);
				break;

				case 'height':
					if (typeof(confElemValue) !== 'number') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'number'. Got type ${typeof(confElemValue)}.`).stack);
					this.#config.socketClient.packetQueue.push(`ui|height|${confElemValue}`);
				break;
			
				case 'x':
					if (typeof(confElemValue) !== 'number') return console.log(new Error(`Setting ${xPos} is expected to be of type 'number'. Got type ${typeof(confElemValue)}.`).stack);
					this.#config.socketClient.packetQueue.push(`ui|xPos|${confElemValue}`);
				break;

				case 'y':
					if (typeof(confElemValue) !== 'number') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'number'. Got type ${typeof(confElemValue)}.`).stack);
					this.#config.socketClient.packetQueue.push(`ui|yPos|${confElemValue}`);
				break;

				case 'backImage':
					if (confElemValue === null) {  this.#config.socketClient.packetQueue.push(`ui|backImage|`);  break;  }
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
					this.#config.socketClient.packetQueue.push(`ui|backImage|${fullPath}`);
				break;

				case 'icon':
					if (confElemValue === null) { this.#config.socketClient.packetQueue.push(`ui|icon|`); break; }
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
					this.#config.socketClient.packetQueue.push(`ui|icon|${fullPath}`);
				break;

				case 'topMost':
					if (typeof(confElemValue) !== 'boolean') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'boolean'. Got type ${typeof(confElemValue)}.`).stack);
					this.#config.socketClient.packetQueue.push(`ui|topMost|${confElemValue}`);
				break;

				case 'notify':
					if (typeof(confElemValue) !== 'string') return console.log(new Error(`Setting ${confElemKey} is expected to be of type 'string'. Got type ${typeof(confElemValue)}.`).stack);
					this.#config.socketClient.packetQueue.push(`ui|notify|${confElemValue}`);
				break;
			}
			if (typeof this.#config[confElemKey] !== 'undefined')
				this.#config[confElemKey] = confElemValue
		}
	}
}
module.exports = NodeUI;