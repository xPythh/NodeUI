var fontFamily = ["Family","Aharoni Bold","Andalus","Angsana New","AngsanaUPC","Aparajita","Arabic Typesetting","Arial","Arial Black","Batang","Browallia New","BrowalliaUPC","Calibri","Cambria","Cambria Math","Candara","Comic Sans MS","Consolas","Constantia","Corbel","Cordia New","CordiaUPC","Courier New","DaunPenh","David","DFKai-SB","DilleniaUPC","DokChampa","Dotum","Ebrima","Estrangelo Edessa","EucrosiaUPC","Euphemia","FangSong","Franklin Gothic Medium","FrankRuehl","FreesiaUPC","Gabriola","Gautami","Georgia","Gisha","Gulim","Gungsuh","Impact","IrisUPC","Iskoola Pota","JasmineUPC","KaiTi","Kalinga","Kartika","Khmer UI","KodchiangUPC","Kokila","Lao UI","Latha","Leelawadee","Levenim MT","LilyUPC","Lucida Console","Lucida Sans Unicode","Malgun Gothic","Mangal","Marlett","Meiryo","Meiryo UI","Microsoft Himalaya","Microsoft JhengHei","Microsoft New Tai Lue","Microsoft PhagsPa","Microsoft Sans Serif","Microsoft Tai Le","Microsoft Uighur","Microsoft YaHei","Microsoft Yi Baiti","MingLiU","Miriam","Mongolian Baiti","MoolBoran","MS Gothic","MS Mincho","MV Boli","Narkisim","Nyala","Palatino Linotype","Plantagenet Cherokee","Raavi","Rod","Sakkal Majalla","Segoe Print","Segoe Script","Segoe UI","Segoe UI Symbol","Shonar Bangla","Shruti","SimHei","Simplified Arabic","SimSun","Sylfaen","Symbol","Tahoma","Times New Roman","Traditional Arabic","Trebuchet MS","Tunga","Utsaah","Vani","Verdana","Vijaya","Vrinda","Webdings","Wingdings"]
var fontStyle = ["Regular", "Bold", "Italic", "Bold, Italic"];

module.exports.fontFamily = fontFamily;
module.exports.fontStyle = fontStyle;


module.exports.generateFont = function(fontSettings = {})
{
	var resultFont = {
		family: "Microsoft Sans Serif",
		size: 8.25,
		style: "",
		underline: false,
		strikeout: false
	}

	for (var [confElemKey, confElemValue] of Object.entries(fontSettings))
	{
		if (typeof(confElemValue) !== typeof(resultFont[confElemKey]))
		{
			console.log(new Error(`Setting ${confElemKey} is expected to be of type '${typeof(resultFont[confElemKey])}'. Got type ${typeof(confElemValue)}.`).stack);				
			return resultFont;
		}

		if (confElemKey === "family")
		{
			if (!fontFamily.includes(confElemValue))
			{
				return console.log(new Error(`Setting ${confElemKey} do not have any option named ${confElemValue}.\nYou can get a list with [CONSTRUCTOR].fontFamily`).stack);
				return resultFont;				
			} else resultFont.family = confElemValue;
		}

		if (confElemKey === "size")
			resultFont.size = confElemValue;

		if (confElemKey === "style")
		{
			if (!fontStyle.includes(confElemValue))
			{
				return console.log(new Error(`Setting ${confElemKey} do not have any option named ${confElemValue}.\nYou can get a list with [CONSTRUCTOR].fontFamily`).stack);
				return resultFont;		
			} else resultFont.style = confElemValue;
		}
		resultFont[confElemKey] = confElemValue;
	}
	var finalFontStyle = [];
	if (resultFont.style !== "") finalFontStyle.push(resultFont.style);

	if (resultFont.underline) finalFontStyle.push("Underline") 
	if (resultFont.strikeout) finalFontStyle.push("Strikeout") 
		console.log(resultFont.size)
	

	var finalString = `${resultFont.family}; ${resultFont.size.toString().replace(".", ",")}pt${(finalFontStyle.length > 0) ? `;style=${finalFontStyle.join(", ")}` : ""}`;
	return finalString;
}