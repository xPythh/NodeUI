# NodeUI
---
<img style="border:1px solid;border-color:#000000;align=left" src=./img/NodeUILB.png  width="100%" height="330px" /> 

---

[![npm version](https://badge.fury.io/js/angular2-expandable-list.svg)](https://badge.fury.io/js/angular2-expandable-list)  ![javascript](https://img.shields.io/badge/%20%20JavaScript-%20%20%20%20730L-f1e05a.svg)

***Create WinForm easily with the power of NodeUI module***
***NodeUI*** *is designed to be the simplest way possible to make lightweight WinForms in NodeJS.*

## Table of contents:bookmark_tabs:
- [**Installation**](#installation)
- [**DEMO CODE**](#demoCode)
- [**WinForm creation and proprieties**](#WinForm-creation-and-proprieties)
	- [**Create a new WinForm**](#newforms)
    - [**PROPERTIES**](#properties)
  - [**Constructor**](#Constructor)
  - [**Events**](#events)

- [**Controls Examples**](#controlexample)

  - [**New UI Label**](#labelcontrolsexample)
  - [**New UI Button**](#buttoncontrolsexample)
  -   [**New UI Checkbox**](#checkboxcontrolsexample)
  -   [**New UI PictureBox**](#pictureBoxcontrolsexample)
  -   [**New UI TextBox**](#textboxcontrolsexample)

----

## Installation 
### Prerequisite

 - Windows
 - NodeJS
```
	$npm i NodeUI
```
---
<a  id="demoCode"></a>
# DEMO CODE

```javascript
	const NodeUI = require("NodeUI");
```
```javascript
	var UI = new NodeUI({
		visible: true,
		backColor: "#FFFFFF",
		title: "New Form",
		width: 750,
		icon: "./icon.ico",
	});
```
**Label Controls example**
```javascript
	var newFunnyLabel = UI.Label({
		text: "HEY I AM FUNNY",
		x: 30,
		y: 30,
		width: 30
	});
```
**TextBox Controls example**
```javascript
	var newFunnyTextBox = UI.TextBox(); 	// Default textbox, no settings will be applied 
		UI.on('ready', () => {
		newFunnyLabel.text = "HEY I AM READY !"
		UI.eval(`return 0.ToString();`);  // evaluate a string and get response with UI evalResult event (or UI error event in case of compilation error
	});
```
---
<a  id="WinForm-creation-and-proprieties"></a>
## WinForm creation and proprieties                           
<a  id="newforms"></a>
**Create a new WinForm**
```javascript
const NodeUI = require("NodeUI");
// A control can be a Button, a Label, a TextBox, a CheckBox etc.. 
// UI is the constructor, holding all main events and is able to create new controls
var UI = new NodeUI();
```

---
<a  id="properties"></a>
**PROPERTIES [GETTER/SETTER]**
---
<br>

|GET          |SET                                     |DESCRIPTION                                                                 |
|--------------|-----------------------------------------|-----------------------------------------------------------------------------|
| UI.x         | UI.x = int                              | WinForm x position relative to the current screen                           |
| UI.y         | UI.y = int                              | WinForm y position relative to the current screen                           |
| UI.tag       | NONE                                    | Identifier that is unique to each form                                      |
| UI.icon      | UI.icon = string                        | WinForm icon (C:/.../image.png \| ./image.png )                             |
| UI.width     | UI.width = int                          | WinForm width                                                               |
| UI.title     | UI.title = string                       | WinForm title                                                               |
| UI.height    | UI.height = int                         | WinForm height                                                              |
| UI.closed    | NONE                                    | Check if the WinForm has been closed                                        |
| UI.topMost   | UI.topMost = bool                       | WinForm position on top or not of all window                                |
| UI.enabled   | UI.enabled = bool                       | WinForm being interactible with                                             |
| UI.visible   | UI.visible = bool                       | WinForm visibility                                                          |
| UI.foreColor | UI.foreColor = string e.g "#FF0000"     | WinForm elements color (Has to be HEX with # \| Transparent is #FF000000)   |
| UI.backColor | UI.backColor = string e.g "#FF0000"     | WinForm background color (Has to be HEX with # \| Transparent is #FF000000) |
| UI.backImage | UI.backImage = string e.g "./image.png" | WinForm background image (C:/.../image.png \| ./image.png )                 |
---
### **UI Getters, Setters and Functions Examples**    

```javascript
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

get consoleVisible() { return this.#config.consoleVisible };
set consoleVisible(consoleVisible) {this.#applyConfig({consoleVisible: consoleVisiblel}) }
```
---
<a  id="Constructor"></a>
## UI Constructor Function
---
 ### **List of Functions for UI**
```javascript
// MessageBox that will be shown
UI.notify("MessageBox !")               
// Function that will make able the user to execute C# on the fly
// NOTE: You need to provide a return
// NOTE: Returned content (can be custom) will be transmited trought the UI event 'evalResult' (See Bottom)
// NOTE: Executed code is not linked to the main form, anything executed is being ran inside a [CodeDomProvider](https://docs.microsoft.com/en-us/dotnet/api/system.codedom.compiler.codedomprovider?view=dotnet-plat-ext-6.0)
UI.eval(`																/
	MessageBox.Show("C# Evaluated Code");
	return 0.ToString();
`)                              
// Close the WinForm
UI.close(); 						 
NOTE: You need to end the code with a return
```
---
<a  id="events"></a>
## UI Constructor Events

*UI and all of the futurely created controls have dedicated events.*

###  **List of events for UI**
```javascript
UI.on('ready', () => {     });                           // Can be used when UI is ready
UI.on('warning', function(warning) {     });             // Warnings are not critical but interesting to look at for potential fix
UI.on('error', function(error) {     });                 // Errors are critical and need to be A. Looked at or B. Reported to us
UI.on('click', () => {     });                  				 // WinForm is being clicked on
UI.on('mouseEnter', () => {     });                      // Mouse enter the WinForm
UI.on('mouseLeave', () => {     });                      // Mouse leave the WinForm
UI.on('mouseMove', function(x, y) {     });              // Mouse move over the WinForm
UI.on('uiClose', () => {     });                         // When the WinForm is being resized
UI.on('notificationClosed', () => {     });              // When a notification from UI.notify has been closed
UI.on('evalResult', function(result) {     });           // Returned content from the function UI.eval
```
---
<a  id="controlexample"></a>
# **Controls Examples**
<a  id="labelcontrolsexample"></a>
## New UI Label

```javascript
var label = UI.Label({ [PROPRIETIES] });
```
###  Listing Getters and Setters functions
```javascript
get parent() { return this.#labelConfig.parent }
get tag() { return this.#labelConfig.tag }	

get text() { return this.#labelConfig.text; }
set text(text) { this.#applyConfig({ text: text }) }
	
get x() { return this.#labelConfig.xPos }
set x(xPos) { this.#applyConfig({ x: xPos }) }

get y() { return this.#labelConfig.y }
set y(yPos) { this.#applyConfig({ y: yPos }) }; 

get width() { return this.#labelConfig.width }
set width(width) { this.#applyConfig({ width: width }) }

get height() { return this.#labelConfig.height }
set height(height) { this.#applyConfig({ height: height }) }; 

get visible() { return this.#labelConfig.visible }
set visible(visible) { this.#applyConfig({ visible: visible }) }

get deleted() { return this.#labelConfig.deleted }
delete() { this.#applyConfig({ delete: true }) }

get foreColor() { return this.#labelConfig.foreColor }
set foreColor(foreColor) { this.#applyConfig({ foreColor: foreColor}) }

get backColor() { return this.#labelConfig.backColor }
set backColor(backColor) { this.#applyConfig({ backColor: backColor}) }

bringToFront() { this.#applyConfig({ bringToFront: true }) }
```
**Event Lists:**
```javascript
label.on('click', () => {     });
label.on('mouseEnter', () => {     });   
label.on('mouseLeave', () => {     });  
label.on('mouseMove', function(x, y) {     });  
```
---
<a  id="buttoncontrolsexample"></a>
## New UI Button

```javascript
var button = UI.Button({ [PROPRIETIES] })
```
### Listing Getters and Setters functions
```javascript
get parent() { return this.#buttonConfig.parent }
get tag() { return this.#buttonConfig.tag }	

get text() { return this.#buttonConfig.text; }
set text(text) { this.#applyConfig({ text: text }) }
	
get x() { return this.#buttonConfig.xPos }
set x(xPos) { this.#applyConfig({ x: xPos }) }

get y() { return this.#buttonConfig.y }
set y(yPos) { this.#applyConfig({ y: yPos }) }; 

get width() { return this.#buttonConfig.width }
set width(width) { this.#applyConfig({ width: width }) }

get height() { return this.#buttonConfig.height }
set height(height) { this.#applyConfig({ height: height }) }; 

get visible() { return this.#buttonConfig.visible }
set visible(visible) { this.#applyConfig({ visible: visible }) }

get deleted() { return this.#buttonConfig.deleted }
delete() { this.#applyConfig({ delete: true }) }

get backImage() {return this.#config.backImage}
set backImage(backImage) {this.#applyConfig({backImage: backImage})}

get foreColor() { return this.#buttonConfig.foreColor }
set foreColor(foreColor) { this.#applyConfig({ foreColor: foreColor}) }

get backColor() { return this.#buttonConfig.backColor }
set backColor(backColor) { this.#applyConfig({ backColor: backColor}) }

get enabled() { return this.#buttonConfig.enabled }
set enabled(enabled) { this.#applyConfig({ enabled: enabled}) }

bringToFront() { this.#applyConfig({ bringToFront: true }) }
```
**Event Lists:**
```javascript
button.on('click', () => {     });
button.on('mouseEnter', () => {     });      
button.on('mouseLeave', () => {     });  
button.on('mouseMove', function(x, y) {     });  
```
---
<a  id="checkboxcontrolsexample"></a>
## New UI Checkbox

```javascript
var checkBox = new UI.checkBox({ [PROPRIETIES] })
```
### Listing Getters and Setters functions

```javascript
get parent() { return this.#checkBoxConfig.parent }
get tag() { return this.#checkBoxConfig.tag }	

get checked() { return this.#checkBoxConfig.checked; }
set checked(checked) { this.#applyConfig({ checked: checked }) }

get x() { return this.#checkBoxConfig.xPos }
set x(xPos) { this.#applyConfig({ x: xPos }) }

get y() { return this.#checkBoxConfig.y }
set y(yPos) { this.#applyConfig({ y: yPos }) }; 

get width() { return this.#checkBoxConfig.width }
set width(width) { this.#applyConfig({ width: width }) }

get height() { return this.#checkBoxConfig.height }
set height(height) { this.#applyConfig({ height: height }) }; 

get visible() { return this.#checkBoxConfig.visible }
set visible(visible) { this.#applyConfig({ visible: visible }) }

get deleted() { return this.#checkBoxConfig.deleted }
delete() { this.#applyConfig({ delete: true }) }

get foreColor() { return this.#checkBoxConfig.foreColor }
set foreColor(foreColor) { this.#applyConfig({ foreColor: foreColor}) }

get backColor() { return this.#checkBoxConfig.backColor }
set backColor(backColor) { this.#applyConfig({ backColor: backColor}) }

get enabled() { return this.#checkBoxConfig.enabled }
set enabled(enabled) { this.#applyConfig({ enabled: enabled}) }

bringToFront() { this.#applyConfig({ bringToFront: true }) }
```

**Event Lists:**
```javascript
checkBox.on('mouseClick', () => {     });     
checkBox.on('mouseEnter', () => {     });   
checkBox.on('mouseLeave', () => {     });  
checkBox.on('mouseMove', function(x, y) {     });  
checkBox.on('checkChanged', function(true) {     }); 
```
***Note:*** checkChanged has one argument that is either true or false.

---
<a  id="pictureBoxcontrolsexample"></a>
## New UI PictureBox

```javascript
var pictureBox = UI.PictureBox({ [PROPRIETIES] });
```
### Listing Getters and Setters functions
```javascript
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
```

**Event Lists:**
```javascript
pictureBox.on('mouseClick', () => {     });   
pictureBox.on('mouseEnter', () => {     });   
pictureBox.on('mouseLeave', () => {     });  
pictureBox.on('mouseMove', function(x, y) {     });  
```
---
<a  id="textboxcontrolsexample"></a>
## New UI TextBox

```javascript
var textBox = UI.TextBox({ [PROPRIETIES] });
```
### Listing Getters and Setters functions

```javascript
get parent() { return this.#textBoxConfig.parent }
get tag() { return this.#textBoxConfig.tag }	

get text() { return this.#textBoxConfig.text; }
set text(text) { this.#applyConfig({ text: text }) }
	
get x() { return this.#textBoxConfig.xPos }
set x(xPos) { this.#applyConfig({ x: xPos }) }

get y() { return this.#textBoxConfig.y }
set y(yPos) { this.#applyConfig({ y: yPos }) }; 

get width() { return this.#textBoxConfig.width }
set width(width) { this.#applyConfig({ width: width }) }

get height() { return this.#textBoxConfig.height }
set height(height) { this.#applyConfig({ height: height }) }; 

get visible() { return this.#textBoxConfig.visible }
set visible(visible) { this.#applyConfig({ visible: visible }) }

get deleted() { return this.#textBoxConfig.deleted }
delete() { this.#applyConfig({ delete: true }) }

get foreColor() { return this.#textBoxConfig.foreColor }
set foreColor(foreColor) { this.#applyConfig({ foreColor: foreColor}) }

get backColor() { return this.#textBoxConfig.backColor }
set backColor(backColor) { this.#applyConfig({ backColor: backColor}) }

bringToFront() { this.#applyConfig({ bringToFront: true }) }
```
**Event Lists:**
```javascript
textBox.on('mouseClick', () => {     });   
textBox.on('mouseEnter', () => {     });   
textBox.on('mouseLeave', () => {     });  
textBox.on('mouseMove', function(x, y) {     });  
textBox.on('textChanged', function(newText) {     }); 
```