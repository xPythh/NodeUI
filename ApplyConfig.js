const fs = require("fs");
const Console = require("./ConsoleManager.js");

module.exports = (configAttrib, controlConfig, defaultValues, packetQueue, controlClass) => 
{
	for (var [confElemKey, confElemValue] of Object.entries(configAttrib))
	{
		var getProprety = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(controlClass), confElemKey);
		if (getProprety && getProprety.set)
		{
			if (typeof(defaultValues[confElemKey]) !== typeof(confElemValue))
				return console.log(new Error(`Setting ${confElemKey} is expected to be of type '${typeof(defaultValues[confElemKey])}'. Got type ${typeof(confElemValue)}.`).stack);
			else
				controlConfig[confElemKey] = confElemValue
			switch (confElemKey) 
			{

				case 'socketPassword': break;
				case 'socketPort': break;




				case 'consoleVisible':
					if (confElemValue === true) Console.Show();
					else Console.Hide();
				break;







				case 'close': packetQueue.push(`ui|close`); break;

				case 'notify': packetQueue.push(`ui|notify|${confElemValue}`); break;

				case 'topMost': packetQueue.push(`ui|topMost|${confElemValue}`); break;

				case 'evalString':
					if (typeof(confElemValue) !== 'string') 
					var base64EvalString = Buffer.from(confElemValue, 'utf-8').toString('base64');
					packetQueue.push(`ui|evalString|${base64EvalString}`);
				break;

				case 'icon':
					if (confElemValue === "") { packetQueue.push(`ui|icon|`); break; }
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
					packetQueue.push(`ui|icon|${fullPath}`);
				break;










				case 'bringToFront': packetQueue.push(`update|bringToFront${controlClass.tag}`); break;

				case 'enabled': packetQueue.push(`update|enabled|${controlClass.tag}|${confElemValue}`); break;

				case 'width': packetQueue.push(`update|width|${controlClass.tag}|${confElemValue}`); break;

				case 'height': packetQueue.push(`update|height|${controlClass.tag}|${confElemValue}`); break;
			
				case 'x': packetQueue.push(`update|xPos|${controlClass.tag}|${confElemValue}`); break;

				case 'y': packetQueue.push(`update|yPos|${controlClass.tag}|${confElemValue}`); break;

				case 'title': packetQueue.push(`update|title|${controlClass.tag}|${confElemValue}`);break;

				case 'text': packetQueue.push(`update|text|${controlClass.tag}|${confElemValue}`); break;

				case 'visible': packetQueue.push(`update|visible|${controlClass.tag}|${confElemValue}`); break;

				case 'foreColor':
					if (!/^#[0-9A-F]{6}|#FF000000$/i.test(confElemValue)) return console.log(new Error(`Setting ${confElemKey} is expecting a HEX color such as #FF0000`).stack)
					packetQueue.push(`update|foreColor|${controlClass.tag}|${confElemValue}`);
				break;

				case 'backColor':
					if (!/^#[0-9A-F]{6}|#FF000000$$/i.test(confElemValue)) return console.log(new Error(`Setting ${confElemKey} is expecting a HEX color such as #FF0000`).stack)
					packetQueue.push(`updata|backColor|${controlClass.tag}|${confElemValue}`);
				break;

				case 'backImage':
					if (confElemValue === "") {  packetQueue.push(`ui|backImage|`);  break;  }
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
					packetQueue.push(`ui|backImage|${fullPath}`);
				break;

				case 'image': 					
					if (confElemValue === "") {  packetQueue.push(`update|image|${controlClass.tag}|`);  break;  }
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
					packetQueue.push(`update|image|${controlClass.tag}|${fullPath}`);
				break;
			}
		}
	}
}