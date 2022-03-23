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
const ProgressBar = require("./Components/ProgressBar.js");


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
		this.ProgressBar = this.progressBar;

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
		exec(`"${__dirname}\\NodeUI.exe" ${this.#config.socketPort} "${this.#config.socketPassword}"`);
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

	get font() { return this.getValue("font")}
	set font(font) { this.#applyConfig({ font: font}) }


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

	progressBar(progressBarConfig = {}) {
		var newProgressBar = new ProgressBar(progressBarConfig, this.#config);
		SocketManager.events.push(newProgressBar);
		return newProgressBar;
	}

	#getValue(configKey) {
		if (this.#config.hasOwnProperty(configKey))
			return this.#config[configKey];
		else
			return defaultValues[configKey];
	}

	#applyConfig(configAttribs) { ApplyConfig(configAttribs, this.#config, defaultValues, this.#config.packetQueue, this); }

}
module.exports = NodeUI;