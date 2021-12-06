sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/unified/FileUploader"
], function(Controller, FileUploader) {
	"use strict";
	var that = this;
	return Controller.extend("multiMulti_Import.controller.App", {
		onInit: function () {

		},
		
		onImport: function () {
			that = this;
			if (this.fixedDialog === undefined) {
				this.fixedDialog = new sap.m.Dialog({
					title: "Choose CSV File For Upload",
					beginButton: new sap.m.Button({
						text: "Upload",
						press: function (oEvent) {
							that.fixedDialog.close();
						}
					}),
					content: [
						new FileUploader("excelUploader")
					],
					endButton: new sap.m.Button({
						text: "Cancel",
						press: function () {
							that.fixedDialog.close();
						}
					})
				});
				this.getView().addDependent(this.fixedDialog);
				this.fixedDialog.attachBeforeClose(this.setDataToJsonFromExcel, this);
			}
			this.fixedDialog.open();
		},
		
		setDataToJsonFromExcel: function (oEvent) {
			var oUploader = oEvent.getSource().getContent()[0];
			var domRef = oUploader.getFocusDomRef();
			if (domRef.files.length === 0) {
				return;
			}
			var file = domRef.files[0];
			that = this;
			this.fileName = file.name;
			this.fileType = file.type;
			var reader = new FileReader();
			reader.onload = function (e) {
				var arrCSV = e.currentTarget.result.match(/[\w .]+(?=,?)/g);
				var noOfCol = 3;
				var headerRow = arrCSV.splice(0, noOfCol);
				var data = [];
				while (arrCSV.length > 0) {
					var record = {};
					var excelData = arrCSV.splice(0, noOfCol);
					for (var i = 0; i < excelData.length; i++) {
						record[headerRow[i]] = excelData[i].trim();
					}
					data.push(record);
				}
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(data);
				var oTable = that.byId("idTable");
				oTable.setModel(oModel);
			};
			reader.readAsBinaryString(file);
			oUploader.clear();
		}
	});
});