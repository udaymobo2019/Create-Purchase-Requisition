sap.ui.define(["sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"./Dialog1",
		"./utilities",
		"sap/m/MessageToast",
		"sap/m/UploadCollectionParameter",
		"sap/ui/model/odata/ODataModel",
		"sap/ui/core/routing/History",
		"sap/ui/model/json/JSONModel"
	], function (BaseController, MessageBox, Dialog1, Utilities, MessageToast, UploadCollectionParameter, ODataModel, History, JSONModel) {
		"use strict";

		return BaseController.extend("com.sap.build.standard.createPrGrunt.controller.Page1", {
			handleRouteMatched: function (oEvent) {
				
				var designation = window.location.origin;
			if(designation === "https://flpnwc-ba293bd41.dispatcher.us1.hana.ondemand.com"){
				this.getView().byId("Dashboard").setVisible(true);
			}
			else{
				this.getView().byId("Dashboard").setVisible(false);
			}

				this.itemNo = "10";
				this.dataModel = new sap.ui.model.json.JSONModel({
					"itemtable": [{
						"Empty1": this.itemNo,
						"Empty2": "",
						"Empty3": "",
						"Empty4": "",
						"Empty5": "",
						"Empty6": "",
						"Empty7": ""

					}]

				});
				console.log("box", this.dataModel);
				this.getView().setModel(this.dataModel, "dataModel");

				var that = this;

				that.addNewItemArray = [];
				that.addNewItemArray1 = [];
				that.baseval = [];
				that.ci_att1 = [];
				that.ci_att1Post = [];
				that.arr142 = [];
				that.arrp = [];
				that.returnMsgArray = [];
				that.header2Item = [];
				// var element = document.getElementById("__layout2-spacer");
				// element.parentNode.removeChild(element);
				//	var el = document.getElementById('__layout12-spacer');
				// el.remove();

				that.purgrpf4();
				

			},
			onBack: function () {
				window.location.replace(
					"https://dashboarddesigngrunt-ba293bd41.dispatcher.us1.hana.ondemand.com/index.html?hc_reset#/PM"
				);

			},
			purOrgChan: function () {
				var purch = this.getView().byId("purchOrg").getSelectedKey();
				var oModel = new ODataModel('/sap/opu/odata/sap/ZMM_F4_SRV_01/', true);
				var sPath = "/VendorSet?$filter=PurchasingOrg eq '" + purch + "'";
				oModel.read(sPath, {
					success: function (oData, oResponse) {
						this.getView().getModel("oGlobalModel").setProperty("/vendorSet", oData.results);
					}.bind(this)
				});
				this.getView().byId("vendorCombo").setEnabled(true);
			},
			qtychange: function (oEvent) {
				
				var table = this.getView().byId("itemTable");
				var index = oEvent.getSource().getBindingContext("dataModel").sPath.split("/")[2];
				var row = table.getItems().length;
				
				
				/*var valueEntered = oEvent.getSource().getValue();
				var valuelength = oEvent.getSource().getValue().length;
				if(valuelength > 17){
					var finalValue = valueEntered.slice(0,16);
					var quant1 = table.getItems()[index].getCells()[3].setValue(finalValue);
					
				}*/
				

				

				var quant = table.getItems()[index].getCells()[3].getValue();

				var prics = this.getView().byId("price").getValue();

				var totprice = quant * parseFloat(this.price);

				this.totalpri = this.getView().byId("totVal").setValue(totprice);

			},
			VendorF4: function () {
				var that = this;
				var sPath = "/VendorF4Set";
				var oModel = new ODataModel('/sap/opu/odata/sap/ZPRJ_PO_MIGO_SRV', true);
				oModel.read(sPath, {
					success: function (oData, oResponse) {
						var count = oData.results.length;
						var oModelj = new JSONModel();
						oModelj.setSizeLimit(2600);
						oModelj.setData(oData);
						var vending = that.getView().byId("vendorCombo");
						vending.setModel(oModelj);
						var temitem = new sap.ui.core.ListItem({
							key: "{Lifnr}",
							text: "{Lifnr} - {Name1}"
						});
						vending.bindAggregation("items", {
							path: "/results",
							template: temitem
						});
					}
				});
			},
			PurchorgF4: function () {
				var that = this;
				var sPath = "/CompanyCodeSet";
				var oModel = new ODataModel('/sap/opu/odata/sap/ZMM_F4_SRV_01', true);
				oModel.read(sPath, {
					success: function (oData, oResponse) {
						
						that.getView().getModel("oGlobalModel").setProperty("/purchaseOrgF4", oData.results);
						
						/*var count = oData.results.length;
						var oModelj = new JSONModel();
						oModelj.setSizeLimit(200);
						oModelj.setData(oData);
						var vending = that.getView().byId("purchOrg");
						vending.setModel(oModelj);
						var temitem = new sap.ui.core.ListItem({
							key: "{PurchasingOrg}",
							text: "{PurchasingOrg}-{PurchasingOrgDes}"
						});
						vending.bindAggregation("items", {
							path: "/results",
							template: temitem
						});*/
					}
				});
			},
			purgrpf4: function () {
				var that = this;
				var sPath = "/PurchaseGroupF4Set";
				var oModel = new ODataModel('/sap/opu/odata/sap/ZPRJ_PR_CREATE_SRV', true);
				oModel.read(sPath, {
					success: function (oData, oResponse) {
						var count = oData.results.length;
						var oModels = new JSONModel();
						oModels.setData(oData);
						var purgrp = that.getView().byId("purGrpCombo");
						purgrp.setModel(oModels);
						var tetit = new sap.ui.core.ListItem({
							key: "{PurGroup}",
							text: "{PurGroup} - {Description}"
						});
						purgrp.bindAggregation("items", {
							path: "/results",
							template: tetit
						});
					}
				});
			},
			documentBind: function () {
				var that = this;

				var plant = sap.ui.core.Fragment.byId("valueHelpfragment", "plantFrag");

				var oModel = new ODataModel('/sap/opu/odata/sap/ZPRJ_PO_MIGO_SRV/', true);
				oModel.read('/PlantF4Set', {

					success: function (oData, oResponse) {
						var Werks = oData.results[0].Werks;

						var dups = [];
						var arr1 = oData.results.filter(function (el) {
							if (dups.indexOf(el.Werks) == -1) {
								dups.push(el.Werks);
								return true;
							}
							return false;
						});
						var arr7 = {
							"arr7": arr1
						};

						console.log("arr6:" + arr7);
						var oItems = new sap.ui.core.ListItem({
							key: "{Werks}",
							text: "{Werks}-{Name1}"
						});
						var oModel = new JSONModel(arr7);
						plant.setModel(oModel);
						plant.bindItems("/arr7", oItems);
					}
				});
			},
			documentBind1: function () {
				var that = this;

				var plant = sap.ui.core.Fragment.byId("valueHelpEditfragment", "plantFragEdit");

				var oModel = new ODataModel('/sap/opu/odata/sap/ZPRJ_PM_APPS_IH_SRV/', true);
				oModel.read('/PlannerGroupF4Set', {

					success: function (oData, oResponse) {
						var PlanningPlant = oData.results[0].PlanningPlant;

						var dups = [];
						var arr1 = oData.results.filter(function (el) {
							if (dups.indexOf(el.PlanningPlant) == -1) {
								dups.push(el.PlanningPlant);
								return true;
							}
							return false;
						});
						var arr7 = {
							"arr7": arr1
						};

						console.log("arr6:" + arr7);
						var oItems = new sap.ui.core.ListItem({
							key: "{PlanningPlant}",
							text: "{PlanningPlant}-{NamePlanningPlant}"
						});
						var oModel = new JSONModel(arr7);
						plant.setModel(oModel);
						plant.bindItems("/arr7", oItems);
					}
				});
			},
			materialTyp: function () {

				var oModelsi = new ODataModel('/sap/opu/odata/sap/ZMM_F4_SRV_01/', true);
				oModelsi.read("/MaterialTypeSet", {
					success: function (oData, oResponse) {
						this.getView().getModel("oGlobalModel").setProperty("/materialtype", oData.results);
					}.bind(this)
				});

			},
			materialTypEdit: function () {

				var that = this;

				var matType = sap.ui.core.Fragment.byId("valueHelpEditfragment", "materialTypeEdit");

				var oModel = new ODataModel('/sap/opu/odata/sap/ZPM_WORKORDER_SRV_01/', true);
				oModel.read('/MaterialF4Set', {

					success: function (oData, oResponse) {
						debugger;
						var MaterialType = oData.results[0].MaterialType;

						var dups = [];
						var arr1 = oData.results.filter(function (el) {
							if (dups.indexOf(el.MaterialType) == -1) {
								dups.push(el.MaterialType);
								return true;
							}
							return false;
						});
						var arr7 = {
							"arr7": arr1
						};

						console.log("arr6:" + arr7);
						var oItems = new sap.ui.core.ListItem({
							key: "{MaterialType}",
							text: "{MaterialType}-{MaterialTypeDesc}"
						});
						var oModel = new JSONModel(arr7);
						oModel.setSizeLimit(4847);
						matType.setModel(oModel);
						matType.bindItems("/arr7", oItems);
					}
				});

			},
			// onAfterRendering: function () {
			// 	var element = document.getElementById("__layout2-spacer");
			// 	element.parentNode.removeChild(element);
			// },

			plantSelChangeFrag: function (oEvent) {
				this.getView().getModel("dataSource").setProperty("/delay", true);
				var t1 = sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable");
				t1.setVisible(true);

				var array1i = [];
				var vendortablei = sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable");
				this.plant = sap.ui.core.Fragment.byId("valueHelpfragment", "plantFrag").getSelectedKey();

				var sPath = "/MaterialF4Set?$filter=Plant eq '" + this.plant + "'";
				var oModel = new ODataModel('/sap/opu/odata/sap/ZPM_WORKORDER_SRV_01/', true);

				oModel.read(sPath, {
					success: function (oData, oResponse) {
						this.getView().getModel("dataSource").setProperty("/delay", false);

						var count = oData.results.length;
						for (var i = 0; i < count; i++) {
							var ponumber = oData.results[i].Material;
							var plant = oData.results[i].Description;
							var uom = oData.results[i].UoM;
							var netpr = oData.results[i].Price;
							var plt = oData.results[i].Plant;
							var currency = oData.results[i].Currency;
							var grp = oData.results[i].PurchaseGroup;
							var grpDesc = oData.results[i].PurchaseGroupDec;

							var obj = {
								Ponumber: ponumber,
								Plant: plant,
								Uom: uom,
								Netpr: netpr,
								Plt: plt,
								Currency: currency,
								Grp: grp,
								Grpdesc: grpDesc
							};
							array1i.push(obj);
							console.log(array1i);
							var oModelccd = new sap.ui.model.json.JSONModel({
								listdata: array1i
							});
							vendortablei.setModel(oModelccd);
						}
						var titems1 = new sap.m.ColumnListItem({
							cells: [new sap.m.Text({
									text: "{Ponumber}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Plant}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Netpr}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Uom}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Plt}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Currency}" //"{itemkey}"  
								}),
								new sap.m.Text({
									text: "{Grp}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Grpdesc}" //"{itemkey}"
								})

							]
						});

						vendortablei.bindItems("/listdata", titems1);

					}.bind(this)
				});

			},
			plantSelChangeFragEdit: function (oEvent) {
				var plant = sap.ui.core.Fragment.byId("valueHelpEditfragment", "plantFragEdit").getSelectedKey();

				// debugger;
				var t1 = sap.ui.core.Fragment.byId("valueHelpEditfragment", "fragTableEdit");
				t1.setVisible(true);
				var oFilters = [new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, plant)];

				//			t1.setModel(oModel);

				var titems1 = new sap.m.ColumnListItem({
					cells: [new sap.m.Text({
							text: "{Material}"
						}), new sap.m.Text({
							text: "{Description}"
						}), new sap.m.Text({
							text: "{Price}"
						}), new sap.m.Text({
							text: "{UoM}"
						}), new sap.m.Text({
							text: "{Plant}"
						}), new sap.m.Text({
							text: "USD"
						}), new sap.m.Text({
							text: "{PurchaseGroup}"
						})

					]
				});

				//		t1.bindItems("/PoItemsGoods", titems1, null, oFilters);
				t1.bindItems({
					path: '/MaterialF4Set',
					parameters: {
						operationMode: "Default"
					},
					template: titems1,
					filters: oFilters
				});

			},
			materialF4Help: function (oEvent) {
				var index = oEvent.getSource().getParent().getBindingContext("dataModel").sPath.split("/")[2];

				this.valueHelpIndex = index;

				this.valueHelpfragment.open();
				this.documentBind();
				this.materialTyp();
				this.materialDesc();

			},
			materialDesc: function () {

				var oModelsi = new ODataModel('/sap/opu/odata/sap/ZPM_F4_SRV/', true);
				oModelsi.read("/MaterialSet", {
					success: function (oData, oResponse) {
						this.getView().getModel("oGlobalModel").setProperty("/materialDesc", oData.results);
					}.bind(this)
				});

			},
			descChange: function (oEvent) {

				var t1 = sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable");
				t1.setVisible(true);

				this.getView().getModel("dataSource").setProperty("/delay", true);

				var array2 = [];
				var vendortable2 = sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable");
				var venchange2 = sap.ui.core.Fragment.byId("valueHelpfragment", "materialDesc")._getSelectedItemText();
				var vend2 = venchange2.split("-");
				var vendin2 = vend2[0];
				var sPath = "/MaterialSet?$filter=MaterialNumber eq '" + vendin2 + "'";
				var oModel = new ODataModel('/sap/opu/odata/sap/ZPM_F4_SRV', true);

				oModel.read(sPath, {
					success: function (oData, oResponse) {

						this.getView().getModel("dataSource").setProperty("/delay", false);
						var count = oData.results.length;
						for (var i = 0; i < count; i++) {
							var ponumber = oData.results[i].MaterialNumber;
							var plant = oData.results[i].MaterialNumberDes;
							var uom = oData.results[i].UOM;
							var netpr = oData.results[i].NetPrice;
							var plt = oData.results[i].Plant;
							var currency = oData.results[i].CurrencyKey;
							var grp = oData.results[i].PurchaseGroup;
							var grpDes = oData.results[i].PurchaseGroupDesc;

							var obj = {
								Ponumber: ponumber,
								Plant: plant,
								Uom: uom,
								Netpr: netpr,
								Plt: plt,
								Currency: currency,
								Grp: grp,
								GrpDes: grpDes
							};
							array2.push(obj);
							var oModelccd = new sap.ui.model.json.JSONModel({
								listdata: array2
							});
							vendortable2.setModel(oModelccd);
						}
						var titems1 = new sap.m.ColumnListItem({
							cells: [new sap.m.Text({
									text: "{Ponumber}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Plant}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Netpr}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Uom}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Plt}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Currency}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Grp}" //"{itemkey}"  
								}),
								new sap.m.Text({
									text: "{GrpDes}" //"{itemkey}"  
								})

							]
						});

						vendortable2.bindItems("/listdata", titems1);

					}.bind(this)
				});

			},

			materialTypChange: function () {

				var t1 = sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable");
				t1.setVisible(true);

				this.getView().getModel("dataSource").setProperty("/delay", true);

				var array1 = [];
				var vendortable = sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable");
				var venchange = sap.ui.core.Fragment.byId("valueHelpfragment", "materialType")._getSelectedItemText();
				var vend = venchange.split("-");
				var vendin = vend[0];
				var sPath = "/MaterialSet?$filter=MaterialType eq '" + vendin + "'";
				var oModel = new ODataModel('/sap/opu/odata/sap/ZPM_F4_SRV', true);

				oModel.read(sPath, {
					success: function (oData, oResponse) {
						this.getView().getModel("dataSource").setProperty("/delay", false);
						var count = oData.results.length;
						for (var i = 0; i < count; i++) {
							var ponumber = oData.results[i].MaterialNumber;
							var plant = oData.results[i].MaterialNumberDes;
							var uom = oData.results[i].UOM;
							var netpr = oData.results[i].NetPrice;
							var plt = oData.results[i].Plant;
							var currency = oData.results[i].CurrencyKey;
							var grp = oData.results[i].PurchaseGroup;
							var grpDes = oData.results[i].PurchaseGroupDesc;

							var obj = {
								Ponumber: ponumber,
								Plant: plant,
								Uom: uom,
								Netpr: netpr,
								Plt: plt,
								Currency: currency,
								Grp: grp,
								GrpDes: grpDes
							};
							array1.push(obj);
							var oModelccd = new sap.ui.model.json.JSONModel({
								listdata: array1
							});
							vendortable.setModel(oModelccd);
						}
						var titems1 = new sap.m.ColumnListItem({
							cells: [new sap.m.Text({
									text: "{Ponumber}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Plant}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Netpr}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Uom}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Plt}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Currency}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{Grp}" //"{itemkey}"
								}),
								new sap.m.Text({
									text: "{GrpDes}" //"{itemkey}"
								})

							]
						});

						vendortable.bindItems("/listdata", titems1);

					}.bind(this)
				});

			},
			materialTypEditChange: function () {

				this.materialTyp = sap.ui.core.Fragment.byId("valueHelpEditfragment", "materialTypeEdit").getSelectedKey();

				// debugger;
				var t1 = sap.ui.core.Fragment.byId("valueHelpEditfragment", "fragTableEdit");
				t1.setVisible(true);
				var oFilters = [new sap.ui.model.Filter("MaterialType", sap.ui.model.FilterOperator.EQ, this.plant)];

				//			t1.setModel(oModel);

				var titems1 = new sap.m.ColumnListItem({
					cells: [new sap.m.Text({
							text: "{Material}",

						}), new sap.m.Text({
							text: "{Description}"
						}), new sap.m.Text({
							text: "{Price}"
						}), new sap.m.Text({
							text: "{UoM}"
						}), new sap.m.Text({
							text: "{Plant}"
						}), new sap.m.Text({
							text: "USD"
						}), new sap.m.Text({
							text: "{PurchaseGroup}"
						})

					]
				});

				//		t1.bindItems("/PoItemsGoods", titems1, null, oFilters);
				t1.bindItems({
					path: '/MaterialF4Set',
					parameters: {
						operationMode: "Default"
					},
					template: titems1,
					filters: oFilters
				});

			},
			purOrgF4Set: function () {
				var that = this;
				var sPath = "/PurchasingOrgF4Set";
				var oModel = new ODataModel('/sap/opu/odata/sap/ZPRJ_PO_MIGO_SRV', true);
				oModel.read(sPath, {
					success: function (oData, oResponse) {
						debugger;
						var count = oData.results.length;
						var oModelj = new sap.ui.model.json.JSONModel();
						oModelj.setSizeLimit(150);
						oModelj.setData(oData);
						var purorgf4 = sap.ui.core.Fragment.byId("itemTablefragment", "purOrgItemFrag");
						purorgf4.setModel(oModelj);
						var oItems = new sap.ui.core.ListItem({
							key: "{Ekorg}",
							text: "{Ekorg}-{Ekotx}"
						});
						purorgf4.bindAggregation("items", {
							path: "/results",
							template: oItems
						});
					}
				});
			},

			materialF4HelpEdit: function (oEvent) {

				this.valueHelpEditfragment.open();
				this.documentBind1();
				this.materialTypEdit();

			},

			itemAddRow: function () {
				var tableother = this.getView().getModel("dataModel").getProperty("/itemtable");
				var tableid = this.getView().byId("itemTable");
				var rowlen = tableid.getItems().length;

				if (rowlen === 0) {

					this.itemNo = "10";
					this.dataModel = new sap.ui.model.json.JSONModel({
						"itemtable": [{
							"Empty1": this.itemNo,
							"Empty2": "",
							"Empty3": "",
							"Empty4": "",
							"Empty5": "",
							"Empty6": "",
							"Empty7": ""

						}]

					});
					console.log("box", this.dataModel);
					this.getView().setModel(this.dataModel, "dataModel");
				} else {

					var rowMinus = rowlen - 1;
					var that = this;

					for (var i = 0; i < rowlen; i++) {
						this.itemadtab = tableid.getItems()[i];
						this.itemadr = tableid.getItems()[rowMinus].getCells()[0].getValue();
						var operation11 = Number(this.itemadr);
						that.itemFrag = operation11 + 10;
						that.itemFragNum = "" + that.itemFrag + "";
						var itemNo = that.itemFragNum;

					}

					var row = {
						"Empty1": itemNo,
						"Empty2": "",
						"Empty3": "",
						"Empty4": "",
						"Empty5": "",
						"Empty6": "",
						"Empty7": ""
					};
					tableother.push(row);
					this.dataModel.refresh();
				}
			},

			itemSeries: function () {
				// debugger;

				var that = this;
				var itemCombo = sap.ui.core.Fragment.byId("itemTablefragment", "itemFrag");
				var itemTab1 = that.getView().byId("itemTable");
				var rowlen = itemTab1.getItems().length;
				var itemNo;

				if (rowlen === 0) {
					itemNo = rowlen + 10;
					itemNo = "" + itemNo + "";
					itemNo = itemNo.padStart(4, '0');

					itemCombo.setValue(itemNo);

				} else {
					var rowlength = rowlen + "0";
					var rowMinus = rowlen - 1;

					var itArr = [];
					// for (var i = 0; i < rowlen; i++) {
					var itemFragNum = itemTab1.getItems()[rowMinus].getCells()[0].getValue();
					var operation11 = Number(itemFragNum);
					that.itemFrag = operation11 + 10;
					that.itemFragNum = "" + that.itemFrag + "";
					itemNo = that.itemFragNum.padStart(4, '0');

					itemCombo.setValue(itemNo);

				}

			},

			onClearFilter: function (oEvent) {
				sap.ui.core.Fragment.byId("valueHelpfragment", "plantFrag").setValue("");
				sap.ui.core.Fragment.byId("valueHelpfragment", "materialType").setValue("");
				sap.ui.core.Fragment.byId("valueHelpfragment", "materialDesc").setValue("");

				sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable").destroyItems();
				sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable").setVisible(false);
				this.documentBind();
				this.materialTyp();
				// this.plantSelChangeFrag();
			},
			onClearFilterEdit: function (oEvent) {
				sap.ui.core.Fragment.byId("valueHelpEditfragment", "plantFragEdit").setValue("");
				sap.ui.core.Fragment.byId("valueHelpEditfragment", "materialTypeEdit").setValue("");
				sap.ui.core.Fragment.byId("valueHelpEditfragment", "materialDescEdit").setValue("");

				sap.ui.core.Fragment.byId("valueHelpEditfragment", "fragTableEdit").destroyItems();
				this.documentBind1();
				this.materialTypEdit();
				// this.plantSelChangeFragEdit();
			},
			onCancelButton: function (oEvent) {
				sap.ui.core.Fragment.byId("valueHelpfragment", "plantFrag").setValue("");
				sap.ui.core.Fragment.byId("valueHelpfragment", "materialType").setValue("");
				sap.ui.core.Fragment.byId("valueHelpfragment", "materialDesc").setValue("");

				sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable").destroyItems();
				sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable").setVisible(false);
				
				this.valueHelpfragment.close();
			},
			onCancelButtonEdit: function (oEvent) {
				sap.ui.core.Fragment.byId("valueHelpEditfragment", "plantFragEdit").setValue("");
				sap.ui.core.Fragment.byId("valueHelpEditfragment", "materialTypeEdit").setValue("");
				sap.ui.core.Fragment.byId("valueHelpEditfragment", "materialDescEdit").setValue("");

				sap.ui.core.Fragment.byId("valueHelpEditfragment", "fragTableEdit").destroyItems();
				this.valueHelpEditfragment.close();
			},
			_onRowPress: function (oEvent) {
				debugger;
				var that = this;
				var oBindingContext = oEvent.getParameter("listItem").getBindingContext("dataModel");

				// var value = oEvent.getSource().getParent().getBindingContext().getPath();
				var ind = oBindingContext.getPath();
				var valueind = ind.split("/");
				var index = valueind[2];

				var pressTable = that.getView().byId("itemTable");
				var pressTableLength = pressTable.getItems().length;
				that.indexRow = Number(index);

				for (var indi = 0; indi < pressTableLength; indi++) {
					// debugger;
					if (indi === that.indexRow) {
						that.rowItem = pressTable.getItems()[indi].getCells()[0].getValue();

						var price = pressTable.getItems()[indi].getCells()[5].getValue();
						var plant = pressTable.getItems()[indi].getCells()[6].getValue();
						var quan = pressTable.getItems()[indi].getCells()[3].getValue();

						var purOrg = pressTable.getItems()[indi].getCells()[7].getValue();
						var purOrgDes = pressTable.getItems()[indi].getCells()[8].getValue();

						var purOrgValue = purOrg + "-" + purOrgDes;

						var total = price * quan;

						/*	var plant = pressTable.getItems()[indi].getCells()[6].getValue();
							var curr = pressTable.getItems()[indi].getCells()[7].getValue();
							var purchass = pressTable.getItems()[indi].getCells()[8].getValue();
							var vendorw = pressTable.getItems()[indi].getCells()[9].getValue();
							var purchorga = pressTable.getItems()[indi].getCells()[10].getValue();*/
						// debugger;
						// var price = that.getView().byId("price").getValue();
						/*price = Number(price);
						item = Number(item);
						var total = price * item;
						total = total + ".00 " + curr;*/
						that.getView().byId("price").setValue(price);
						that.getView().byId("plantCombo").setValue(plant);
						that.getView().byId("totVal").setValue(total);
						that.getView().byId("purGrpCombo").setValue(purOrgValue);
						/*that.getView().byId("totVal").setValue(total);
						that.getView().byId("plantCombo").setValue(plant);
						
						that.getView().byId("purGrpCombo").setValue(purchass);
						that.getView().byId("vendorCombo").setValue(vendorw);
						that.getView().byId("purchOrg").setValue(purchorga);*/
					} else {

					}
				}
			},
			onOkButton: function () {
				var tableid = sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable");
				var item = sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable").getSelectedItem();
				var tablelength = tableid.getSelectedItems().length;
				console.log("TableLenth :", tablelength);
				for (var i = 0; i < tablelength; i++) {
					var rows = tableid.getSelectedItems()[i];
					var material = rows.getCells()[0].getText();

					var desc = rows.getCells()[1].getText();

					this.price = rows.getCells()[2].getText();

					var uom = rows.getCells()[3].getText();

					this.plant = rows.getCells()[4].getText();

					var curr = rows.getCells()[5].getText();
					var purchGrp = rows.getCells()[6].getText();

					var purchGrpDes = rows.getCells()[7].getText();

					var table = this.dataModel.getProperty("/itemtable");
					table[this.valueHelpIndex].Empty2 = material;
					table[this.valueHelpIndex].Empty3 = desc;
					table[this.valueHelpIndex].Empty5 = uom;

					table[this.valueHelpIndex].Empty6 = this.price;
					table[this.valueHelpIndex].Empty7 = this.plant;
					table[this.valueHelpIndex].Empty8 = purchGrp;
					table[this.valueHelpIndex].Empty9 = purchGrpDes;

					this.dataModel.refresh();

					this.getView().byId("plantCombo").setValue(this.plant);
					this.prisc = this.getView().byId("price").setValue(this.price);
					this.getView().byId("purGrpCombo").setValue(purchGrp + '-' + purchGrpDes);
					this.getView().byId("totVal").setValue("");
					this.getView().byId("vendorCombo").setValue("");

					sap.ui.core.Fragment.byId("valueHelpfragment", "plantFrag").setValue("");
					sap.ui.core.Fragment.byId("valueHelpfragment", "materialType").setValue("");
					sap.ui.core.Fragment.byId("valueHelpfragment", "materialDesc").setValue("");
					sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable").destroyItems();
					sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable").setVisible(false);
					this.valueHelpfragment.close();
				}
				this.PurchorgF4();

			},
			quanLimit: function (oEvent) {
				var that = this;
				var _oInput = oEvent.getSource();
				that.len = _oInput.getValue();
				that.val = _oInput.getValue().length;
				if (that.val > 4) {
					that.l = that.len.slice(0, 4);
					sap.ui.core.Fragment.byId("itemTablefragment", "quanItemFrag").setValue(that.l);
				}
			},
			quanLimitEdit: function (oEvent) {
				var that = this;
				var _oInput = oEvent.getSource();
				that.len = _oInput.getValue();
				that.val = _oInput.getValue().length;
				if (that.val > 4) {
					that.l = that.len.slice(0, 4);
					sap.ui.core.Fragment.byId("editTablefragment", "quanItemFragEdit").setValue(that.l);
				}
			},
			onOkButtonEdit: function () {
				// this.valueHelpEditfragment.close();
				// debugger;
				var that = this;
				var tableid = sap.ui.core.Fragment.byId("valueHelpEditfragment", "fragTableEdit");
				var item = sap.ui.core.Fragment.byId("valueHelpEditfragment", "fragTableEdit").getSelectedItem();
				var tablelength = tableid.getSelectedItems().length;
				console.log("TableLenth :", tablelength);
				for (var i = 0; i < tablelength; i++) {
					var rows = tableid.getSelectedItems()[i];
					var itemData = rows.getCells()[0].getText();

					var desc = rows.getCells()[1].getText();
					var price = rows.getCells()[2].getText();
					var uom = rows.getCells()[3].getText();
					var plant1 = rows.getCells()[4].getText();
					var curr1 = rows.getCells()[5].getText();
					var purchGrp1 = rows.getCells()[6].getText();

					sap.ui.core.Fragment.byId("editTablefragment", "matItemFragEdit").setValue(itemData);

					sap.ui.core.Fragment.byId("editTablefragment", "matDescItemFragEdit").setValue(desc);
					sap.ui.core.Fragment.byId("editTablefragment", "priceItemFragEdit").setValue(price);
					sap.ui.core.Fragment.byId("editTablefragment", "uomItemFragEdit").setValue(uom);
					sap.ui.core.Fragment.byId("editTablefragment", "plantDataItemFragEdit").setValue(plant1);

					sap.ui.core.Fragment.byId("editTablefragment", "currencyItemFragEdit").setValue(curr1);
					sap.ui.core.Fragment.byId("editTablefragment", "purchGrpItemFragEdit").setValue(purchGrp1);

				}
				sap.ui.core.Fragment.byId("valueHelpEditfragment", "plantFragEdit").setValue("");
				sap.ui.core.Fragment.byId("valueHelpEditfragment", "materialTypeEdit").setValue("");
				sap.ui.core.Fragment.byId("valueHelpEditfragment", "materialDescEdit").setValue("");
				sap.ui.core.Fragment.byId("valueHelpEditfragment", "fragTableEdit").destroyItems();

				this.valueHelpEditfragment.close();

			},
			itemTableClose: function () {
				debugger;
				this.addNewItemArray = [];
				var itemFragNumber = sap.ui.core.Fragment.byId("itemTablefragment", "itemFrag").getValue();
				var materialFrag = sap.ui.core.Fragment.byId("itemTablefragment", "matItemFrag").getValue();
				var matDesc = sap.ui.core.Fragment.byId("itemTablefragment", "matDescItemFrag").getValue();
				var quantityFrag = sap.ui.core.Fragment.byId("itemTablefragment", "quanItemFrag").getValue();
				var priceFrag = sap.ui.core.Fragment.byId("itemTablefragment", "priceItemFrag").getValue();
				var UOMFrag = sap.ui.core.Fragment.byId("itemTablefragment", "uomItemFrag").getValue();
				var plantDataFrag = sap.ui.core.Fragment.byId("itemTablefragment", "plantDataItemFrag").getValue();
				var curren = sap.ui.core.Fragment.byId("itemTablefragment", "currencyItemFrag").getValue();
				var purch = sap.ui.core.Fragment.byId("itemTablefragment", "purchGrpItemFrag").getValue();
				var vendor = sap.ui.core.Fragment.byId("itemTablefragment", "vendorItemFrag").getValue();
				var purorg = sap.ui.core.Fragment.byId("itemTablefragment", "purOrgItemFrag").getValue();

				quantityFrag = Number(quantityFrag);
				priceFrag = Number(priceFrag);
				var total = quantityFrag * priceFrag;
				var curr = "USD";
				total = total + ".00 " + curr;
				this.getView().byId("totVal").setValue(total);
				this.getView().byId("plantCombo").setValue(plantDataFrag);
				this.getView().byId("price").setValue(priceFrag);
				this.getView().byId("purGrpCombo").setValue(purch);
				this.getView().byId("vendorCombo").setValue(vendor);
				this.getView().byId("purchOrg").setValue(purorg);

				var itemTable = this.getView().byId("itemTable");
				var rowlen = itemTable.getItems().length;
				var that = this;

				for (var i = 0; i < rowlen; i++) {

					var item = itemTable.getItems()[i].getCells()[0].getValue();
					var material = itemTable.getItems()[i].getCells()[1].getValue();
					var description = itemTable.getItems()[i].getCells()[2].getValue();
					var quantity = itemTable.getItems()[i].getCells()[3].getValue();
					var pric = itemTable.getItems()[i].getCells()[4].getValue();
					var UOM = itemTable.getItems()[i].getCells()[5].getValue();
					var PlantDat = itemTable.getItems()[i].getCells()[6].getValue();
					var curre = itemTable.getItems()[i].getCells()[7].getValue();
					var purcha = itemTable.getItems()[i].getCells()[8].getValue();
					var vendore = itemTable.getItems()[i].getCells()[9].getValue();
					var purcorg = itemTable.getItems()[i].getCells()[10].getValue();

					var addNewItemObj = {
						Item: item,
						Material: material,
						Description: description,
						Quantity: quantity,
						Price: pric,
						UOM: UOM,
						Plant: PlantDat,
						Currency: curre,
						PurchaseGroup: purcha,
						Vendor: vendore,
						PurchaseOrg: purcorg

					};

					that.addNewItemArray.push(addNewItemObj);
				}

				if (itemFragNumber === "") {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.alert("Please enter the Item No.", {
						title: "Error",
						onClose: null
					});
				} else if (materialFrag === "") {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.alert("Please enter the Material", {
						title: "Error",
						onClose: null
					});
				} else if (matDesc === "") {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.alert("Please enter the Mat. Description", {
						title: "Error",
						onClose: null
					});
				} else if (quantityFrag === "" || quantityFrag === 0) {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.alert("Please enter the Quantity", {
						title: "Error",
						onClose: null
					});
				} else if (UOMFrag === "") {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.alert("Please enter the UOM", {
						title: "Error",
						onClose: null
					});
				} else {
					// that.itemTable.close();
					that.busyDialogDownloadFun();
					var obj = {

						Item: itemFragNumber,
						Material: materialFrag,
						Description: matDesc,
						Quantity: quantityFrag,
						Price: priceFrag,
						UOM: UOMFrag,
						Plant: plantDataFrag,
						Currency: curren,
						PurchaseGroup: purch,
						Vendor: vendor,
						PurchaseOrg: purorg

					};

					that.addNewItemArray.push(obj);
					that.addNewItemArray1 = {
						"addNewItemArray1": that.addNewItemArray
					};

					// var that = this;

					that.oModel3 = this.getView().getModel("oGlobalModel").getProperty("/oModel3");

					that.oModel3 = new sap.ui.model.json.JSONModel(that.addNewItemArray1);
					var itemTab = that.getView().byId("itemTable");
					itemTab.setModel(that.oModel3);

					var titems1 = new sap.m.ColumnListItem({
						type: "Active",
						/*	press: function (oEvent) {
								that._onRowPress(oEvent);
							},*/

						cells: [new sap.m.Input({
								value: "{Item}",
								// maxLength: 4,
								editable: false
							}), new sap.m.Input({
								value: "{Material}",
								// maxLength: 18,
								editable: false
							}),
							new sap.m.Input({
								value: "{Description}",
								// maxLength: 40,
								editable: false
							}),
							new sap.m.Input({
								value: "{Quantity}",
								// maxLength: 4,
								editable: false
							}), new sap.m.Input({
								value: "{Price}",
								// maxLength: 10,
								editable: false,
								visible: false
							}), new sap.m.Input({
								value: "{UOM}",
								// maxLength: 3,
								editable: false
							}), new sap.m.Input({
								value: "{Plant}",
								// maxLength: 10,
								editable: false,
								visible: false
							}),
							new sap.m.Input({
								value: "{Currency}",
								// maxLength: 10,
								editable: false,
								visible: false
							}),
							new sap.m.Input({
								value: "{PurchaseGroup}",
								// maxLength: 10,
								editable: false,
								visible: false
							}), new sap.m.Input({
								value: "{Vendor}",
								// maxLength: 10,
								editable: false,
								visible: false
							}),
							new sap.m.Input({
								value: "{PurchaseOrg}",
								// maxLength: 10,
								editable: false,
								visible: false
							}),

							new sap.m.Button({
								// icon: "sap-icon://edit",
								text: "Edit",
								type: sap.m.ButtonType.Transparent,
								press: function (oArg) {
									that.editItem(oArg);
								}
							}),

							new sap.m.Button({
								// icon: "sap-icon://delete",
								text: "Delete",
								type: sap.m.ButtonType.Transparent,
								press: function (oArg) {
									that.deleteItem(oArg);
								}
							})

						]
					});

					itemTab.bindItems("/addNewItemArray1", titems1);
					that.itemTable.close();
				}
			},
			editItem: function (oArg) {
				// debugger;
				var that = this;
				var value = oArg.getSource().getParent().getBindingContext().getPath();
				var valueind = value.split("/");
				that.index = valueind[2];

				var itemTable = this.getView().byId("itemTable");
				var rowlen = itemTable.getItems().length;
				that.index = Number(that.index);
				for (var indexVal = 0; indexVal < rowlen; indexVal++) {

					if (indexVal === that.index) {
						var item = itemTable.getItems()[indexVal].getCells()[0].getValue();
						var material = itemTable.getItems()[indexVal].getCells()[1].getValue();
						var description = itemTable.getItems()[indexVal].getCells()[2].getValue();
						var quantity = itemTable.getItems()[indexVal].getCells()[3].getValue();
						var pric = itemTable.getItems()[indexVal].getCells()[4].getValue();
						var UOM = itemTable.getItems()[indexVal].getCells()[5].getValue();
						var plant = itemTable.getItems()[indexVal].getCells()[6].getValue();
						var curry = itemTable.getItems()[indexVal].getCells()[7].getValue();
						var purchs = itemTable.getItems()[indexVal].getCells()[8].getValue();
						var ven = itemTable.getItems()[indexVal].getCells()[9].getValue();
						var purchorgs = itemTable.getItems()[indexVal].getCells()[10].getValue();

						sap.ui.core.Fragment.byId("editTablefragment", "itemFragEdit").setValue(item);
						sap.ui.core.Fragment.byId("editTablefragment", "matItemFragEdit").setValue(material);
						sap.ui.core.Fragment.byId("editTablefragment", "matDescItemFragEdit").setValue(description);
						sap.ui.core.Fragment.byId("editTablefragment", "quanItemFragEdit").setValue(quantity);
						sap.ui.core.Fragment.byId("editTablefragment", "priceItemFragEdit").setValue(pric);
						sap.ui.core.Fragment.byId("editTablefragment", "uomItemFragEdit").setValue(UOM);
						sap.ui.core.Fragment.byId("editTablefragment", "plantDataItemFragEdit").setValue(plant);
						sap.ui.core.Fragment.byId("editTablefragment", "currencyItemFragEdit").setValue(curry);
						sap.ui.core.Fragment.byId("editTablefragment", "purchGrpItemFragEdit").setValue(purchs);
						sap.ui.core.Fragment.byId("editTablefragment", "vendorItemFragEdit").setValue(ven);
						sap.ui.core.Fragment.byId("editTablefragment", "purOrgItemFragEdit").setValue(purchorgs);

					} else {

					}

				}

				this.editTable.open();
				this.vendorF4DataEdit();
				this.purOrgF4SetEdit();

			},
			purOrgF4SetEdit: function () {

				var that = this;
				var sPath = "/PurchasingOrgF4Set";
				var oModel = new ODataModel('/sap/opu/odata/sap/ZPRJ_PO_MIGO_SRV', true);
				oModel.read(sPath, {
					success: function (oData, oResponse) {
						debugger;
						var count = oData.results.length;
						var oModelj = new sap.ui.model.json.JSONModel();
						oModelj.setSizeLimit(150);
						oModelj.setData(oData);
						var purorgf4 = sap.ui.core.Fragment.byId("editTablefragment", "purOrgItemFragEdit");
						purorgf4.setModel(oModelj);
						var oItems = new sap.ui.core.ListItem({
							key: "{Ekorg}",
							text: "{Ekorg}-{Ekotx}"
						});
						purorgf4.bindAggregation("items", {
							path: "/results",
							template: oItems
						});
					}
				});

			},
			itemTableCloseEdit: function () {
				// debugger;
				var that = this;
				var edItem = sap.ui.core.Fragment.byId("editTablefragment", "itemFragEdit").getValue();
				var edMaterial = sap.ui.core.Fragment.byId("editTablefragment", "matItemFragEdit").getValue();
				var edMatDesc = sap.ui.core.Fragment.byId("editTablefragment", "matDescItemFragEdit").getValue();
				var edQuantity = sap.ui.core.Fragment.byId("editTablefragment", "quanItemFragEdit").getValue();
				var edPrice = sap.ui.core.Fragment.byId("editTablefragment", "priceItemFragEdit").getValue();
				var edUOM = sap.ui.core.Fragment.byId("editTablefragment", "uomItemFragEdit").getValue();
				var edPlantData = sap.ui.core.Fragment.byId("editTablefragment", "plantDataItemFragEdit").getValue();
				var edCurrency = sap.ui.core.Fragment.byId("editTablefragment", "currencyItemFragEdit").getValue();
				var edPurchGrp = sap.ui.core.Fragment.byId("editTablefragment", "purchGrpItemFragEdit").getValue();
				var edVendor = sap.ui.core.Fragment.byId("editTablefragment", "vendorItemFragEdit").getValue();
				// var split = edVend.split("-");
				// var edVendor = split[0];
				var edPurchOrg = sap.ui.core.Fragment.byId("editTablefragment", "purOrgItemFragEdit").getValue();

				if (edQuantity === "" || edQuantity === 0) {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.alert("Please enter the Quantity", {
						title: "Error",
						onClose: null
					});
				} else {
					var itemTable = that.getView().byId("itemTable");
					var rowlen = itemTable.getItems().length;

					for (var indexVal = 0; indexVal < rowlen; indexVal++) {

						if (indexVal === that.index) {

							itemTable.getItems()[indexVal].getCells()[0].setValue(edItem);
							itemTable.getItems()[indexVal].getCells()[1].setValue(edMaterial);
							itemTable.getItems()[indexVal].getCells()[2].setValue(edMatDesc);
							itemTable.getItems()[indexVal].getCells()[3].setValue(edQuantity);
							itemTable.getItems()[indexVal].getCells()[4].setValue(edPrice);
							itemTable.getItems()[indexVal].getCells()[5].setValue(edUOM);
							itemTable.getItems()[indexVal].getCells()[6].setValue(edPlantData);
							itemTable.getItems()[indexVal].getCells()[7].setValue(edCurrency);
							itemTable.getItems()[indexVal].getCells()[8].setValue(edPurchGrp);
							itemTable.getItems()[indexVal].getCells()[9].setValue(edVendor);
							itemTable.getItems()[indexVal].getCells()[10].setValue(edPurchOrg);

							this.editTable.close();

						} else {

						}
					}
				}
			},
			itemTableCancelEdit: function () {
				this.editTable.close();
			},
			itemTableCancel: function () {
				this.itemTable.close();
			},
			deleteItem: function (oEvent) {
				var that = this;
				var index = oEvent.getSource().getParent().getBindingContext("dataModel").sPath.split("/")[2];

				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.show(
					"Do you want to Delete this Item?", {
						icon: sap.m.MessageBox.Icon.QUESTION,
						title: "Confirmation Message",
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function (oAction) {
							// notify user
							if (oAction == "YES") {

								var table = that.getView().getModel("dataModel").getProperty("/itemtable");
								table.splice(index, 1);
								that.dataModel.refresh();
								that.getView().byId("plantCombo").setValue("");
								that.getView().byId("price").setValue("");
								that.getView().byId("purchOrg").setValue("");
								that.getView().byId("purGrpCombo").setValue("");
								that.getView().byId("vendorCombo").setValue("");

							} else if (oAction == "NO") {

							}
						}
					});

			},

			_onOverflowToolbarButtonPress: function (oEvent) {

				var sDialogName = "Dialog1";
				this.mDialogs = this.mDialogs || {};
				var oDialog = this.mDialogs[sDialogName];
				if (!oDialog) {
					oDialog = new Dialog1(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}

				var context = oEvent.getSource().getBindingContext();
				oDialog._oControl.setBindingContext(context);

				oDialog.open();

			},

			vendorF4Data: function () {

				var that = this;
				var sPath = "/VendorF4Set";
				var oModel = new ODataModel('/sap/opu/odata/sap/ZPRJ_PO_MIGO_SRV', true);
				oModel.read(sPath, {
					success: function (oData, oResponse) {
						var count = oData.results.length;
						var oModelj = new sap.ui.model.json.JSONModel();
						oModelj.setSizeLimit(2450);
						oModelj.setData(oData);
						var vendorCombo = sap.ui.core.Fragment.byId("itemTablefragment", "vendorItemFrag");
						vendorCombo.setModel(oModelj);
						var oItems = new sap.ui.core.ListItem({
							key: "{Lifnr}",
							text: "{Lifnr}-{Name1}"
						});
						vendorCombo.bindAggregation("items", {
							path: "/results",
							template: oItems
						});
					}
				});

				/////////////////////////

			},
			vendorF4DataEdit: function () {
				var vendorCombo = sap.ui.core.Fragment.byId("editTablefragment", "vendorItemFragEdit");
				var sPath = "/VendorF4Set";
				var oModel = new ODataModel("/sap/opu/odata/sap/ZPM_WORKORDER_SRV_01/", true);
				oModel.read(sPath, {

					success: function (oData, oResponse) {
						var Vendor = oData.results[0].Vendor;

						var dups = [];
						var arr = oData.results.filter(function (el) {
							if (dups.indexOf(el.Vendor) == -1) {
								dups.push(el.Vendor);
								return true;
							}
							return false;
						});
						var arr6 = {
							"arr6": arr
						};

						var oItems = new sap.ui.core.ListItem({
							key: "{Vendor}",
							text: "{Vendor}-{Name}"
						});
						var oModel = new JSONModel(arr6);
						vendorCombo.setModel(oModel);
						vendorCombo.bindItems("/arr6", oItems);
					}
				});

			},
			savePress: function () {
				
				
					

				var that = this;
				that.header2Item = [];
				
				var documentType = that.getView().byId("documentTypeCombo").getSelectedKey();
				var headerText = that.getView().byId("headerText").getValue();
				var Plant = that.getView().byId("plantCombo").getValue();
				var VendorP1 = that.getView().byId("vendorCombo").getValue();
				var vendor = VendorP1.split("-");
				var VendorP = vendor[0];
				var PurchGR1 = that.getView().byId("purGrpCombo").getSelectedKey();
				/*var purchase = PurchGR1.split("-");
				var PurchGR = purchase[0];*/
				var PurchOrg1 = that.getView().byId("purchOrg").getSelectedKey();
				

				var itemTab = that.getView().byId("itemTable");
				var rowlen = itemTab.getItems().length;
				var quanArray = [];
				var Quantity;
					var table = this.dataModel.getProperty("/itemtable");
					var i;
				for(i = 0 ; i < table.length ; i++){
					var Quan = table[i].Empty4;
					var Material = table[i].Empty2;
					
					var obj = {
					quan:Quan,
					material:Material
					};
					quanArray.push(obj);
					
				}
			var ten = quanArray.filter(function(result){
					return result.quan === "";
					
				});
				console.log("ten",ten);
				var ten1 = quanArray.filter(function(result){
					return result.material === "";
					
				});
				
			
				
				

				if (documentType === "") {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.error("Select Document Type!!", {
						title: "Error",
						onClose: null
					});
				} else if (rowlen === 0) {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.error("Please add items for PR!!", {
						title: "Error",
						onClose: null
					});
				}
				
				else if(ten1.length !== 0){
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.error("Please Select the Material", {
						title: "Error",
						onClose: null
					});
				}
				
				else if(ten.length !== 0){
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.error("Please enter the Quantity", {
						title: "Error",
						onClose: null
					});
				}
				
				
				
				else {  

					
					for (var i = 0; i < rowlen; i++) {
						// debugger;
						var itemNum = itemTab.getItems()[i].getCells()[0].getValue();
						var materialNum = itemTab.getItems()[i].getCells()[1].getValue();
						var descript = itemTab.getItems()[i].getCells()[2].getValue();
						var quantity = itemTab.getItems()[i].getCells()[3].getValue();
						var uom = itemTab.getItems()[i].getCells()[4].getValue();

						var obj1 = {
							ItemNumber: itemNum, // "0010",
							PurchasingGroup: PurchGR1,
							ShorText: descript, // "Test",
							Material: materialNum, // "CH01",
							Plant: Plant, //"3000",
							Quantity: quantity, // "10",
							Unit: uom, // "M"
							PurchasingOrganisation: PurchOrg1,
							Vendor: VendorP
						};

						that.header2Item.push(obj1);
					}
					
				
				

					that.busyDialogDownloadFun();
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(
						"Do you want to Create PR?", {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Information Message",
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								// notify user
								if (oAction == "YES") {
									that.busyDialogDownloadFun();
									that.oModel3 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZMM_PR_CREATE_SRV/", true);

									var postdata = {

										DocumentType: documentType, // "NB",
										HeaderText: headerText, //"Test",
										Header2Item: that.header2Item,
										Header2Result: [{
											Type: "",
											Message: "",
											ItermNumber: ""
										}]
									};
									console.log(postdata);
									debugger;
									var sPath = "/CreatePRHeaderSet";
									// debugger;
									that.oModel3.create(sPath, postdata, {
										success: function (oData, oResponse) {
											// debugger;
											that.busyDialogDownloadFun();
											that.descrip = postdata.HeaderText;
											var tablen = oData.Header2Result.results.length;

											for (var index = 0; index < tablen; index++) {

												var Type = oData.Header2Result.results[index].Type;
												console.log("Type", Type);

												if (Type === "I") {

													Type = "Information";
													console.log("Type", Type);

												} else if (Type === "S") {

													Type = "Success";
													console.log("Type", Type);

												} else if (Type === "E") {

													Type = "Error";
													console.log("Type", Type);

												} else if (Type === "W") {

													Type = "Warning";
													console.log("Type", Type);

												}

												var ItermNumber = oData.Header2Result.results[index].ItermNumber;
												console.log("ItermNumber", ItermNumber);

												if (Type === "Success") {
													var Message = oData.Header2Result.results[index].Message;
													that.PRNumber = Message.slice(37, 47);
													console.log("PR Number", that.PRNumber);

												} else {

													var Message = oData.Header2Result.results[index].Message;
													console.log("Message", Message);
												}

												var obj = {
													Type: Type,
													ItermNumber: ItermNumber,
													Message: Message
												};

												that.returnMsgArray.push(obj);

											}

											that.returnMessageTable.open();

											that.table = sap.ui.core.Fragment.byId("returnMessagefragment", "resultsTable");
											that.oModelJson = new JSONModel();
											that.oModelJson.setData({
												tabdata1: that.returnMsgArray
											});
											that.table.setModel(that.oModelJson);

											that.descrip1 = postdata.HeaderText;
											that.ci_att1 = that.getView().byId("UploadCollection").getItems().length;

											if (that.ci_att1 == '0') {

												// window.location.reload();
											} else {

												that.DMS();
												// window.location.reload();
											}

										},
										error: function (oData, oResponse) {

											sap.m.MessageBox.confirm("Service URL Error", {
												icon: sap.m.MessageBox.Icon.ERROR,
												title: "Error",
												actions: [sap.m.MessageBox.Action.OK],

												onClose: function (oAction) {

													if (oAction == "OK") {

														that.destroyData();
														window.location.reload();
													}
												}.bind(this)
											});

										}

									});

								} else if (oAction == "NO") {

								}
							}
						});
				}
			},
			returnTableOK: function () {
				this.busyDialogDownloadFun();
				this.destroyData();
				this.returnMessageTable.close();
				window.location.reload();
			},
			DMS: function () {

				this.ci_att1Post = this.getView().getModel("oGlobalModel").getProperty("/ci_att1");

				var oUploadCollection = this.getView().byId("UploadCollection");

				var user = parent.sap.ushell.Container.getUser().getId();

				var that = this;
				that.arr142 = [];
				that.arrp = [];
				var count = that.ci_att1Post.length;

				for (var i = 0; i < count; i++) {
					var dmsdata = {
						"DocType": that.ci_att1Post[i].Ext,
						"FileName": that.ci_att1Post[i].Name,
						"Base64": that.ci_att1Post[i].Base64

					};
					that.arr142.push(dmsdata);
				}
				var obj = {
					"d": {
						"ProcessName": "PR_Application", //WorkOrder
						"Description": that.descrip,
						"Username": user, //Login User
						"NotificationNo": that.PRNumber,
						"To_DMSItems": that.arr142
					}
				};
				that.arrp.push(obj);
				// debugger;

				var oModel142 = new ODataModel("/sap/opu/odata/sap/ZPRJ_PM_APPS_IH_SRV/", true);
				var sPath = "/DMS_HeaderSet";

				oModel142.create(sPath, obj, {
					success: function (oData, oResponse) {

						var msg = oData.ReturnMessage;
						// debugger;
						var typ = oData.ReturnType;

						if (typ == "S") {

							MessageToast.show(msg);
						} else {
							MessageToast.show(msg);
						}

					},
					error: function (oData, oResponse) {
						MessageToast.show("Service URL Error");
					}

				});

			},
			cancelPress: function () {
				var that = this;
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.show(
					"Do you want to clear data?", {
						icon: sap.m.MessageBox.Icon.INFORMATION,
						title: "Information Message",
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function (oAction) {
							// notify user

							if (oAction == "YES") {

								that.destroyData();

							} else if (oAction == "NO") {

							}
						}
					});
			},
			destroyData: function () {
				var that = this;
				var itemTable = that.getView().byId("itemTable");

				that.getView().byId("documentTypeCombo").setSelectedKey("");
				that.getView().byId("headerText").setValue("");
				that.getView().byId("plantCombo").setValue("");
				that.getView().byId("purchOrg").setValue("");
				that.getView().byId("price").setValue("");
				that.getView().byId("vendorCombo").setValue("");
				that.getView().byId("purGrpCombo").setValue("");
				that.getView().byId("totVal").setValue("");
				itemTable.destroyItems();

				that.deleteAttachments();
			},
			deleteAttachments: function () { //d
				var that = this;
				var uploadList = that.getView().byId("UploadCollection");
				uploadList.destroyItems();
				that.baseval = [];
				that.ci_att1 = [];
				that.ci_att1Post = [];
				that.arr142 = [];
				that.arrp = [];
			},
			_onUploadCollectionUploadComplete: function (oEvent) {

				var oFile = oEvent.getParameter("files")[0];
				var iStatus = oFile ? oFile.status : 500;
				var sResponseRaw = oFile ? oFile.responseRaw : "";
				var oSourceBindingContext = oEvent.getSource().getBindingContext();
				var sSourceEntityId = oSourceBindingContext ? oSourceBindingContext.getProperty("ID") : null;
				var oModel = this.getView().getModel();

				return new Promise(function (fnResolve, fnReject) {
					var fnSync = function () {
						oModel.detachRequestCompleted(fnRefreshCompleted);
						oModel.detachRequestFailed(fnRefreshFailed);
					};
					var fnRefreshCompleted = function () {
						fnSync();
						fnResolve();
					};
					var fnRefreshFailed = function () {
						fnSync();
						fnReject(new Error("refresh failed"));
					};
					var fnResolveAfterRefresh = function () {
						oModel.attachRequestCompleted(fnRefreshCompleted);
						oModel.attachRequestFailed(fnRefreshFailed);
						oModel.refresh(true, true);
					};

					if (iStatus !== 200) {
						fnReject(new Error("Upload failed"));
					} else if (oModel.hasPendingChanges()) {
						fnReject(new Error("Please save your changes, first"));
					} else if (!sSourceEntityId) {
						fnReject(new Error("No source entity key"));
					} else {
						try {
							var oResponse = JSON.parse(sResponseRaw);
							var oNewEntityInstance = {};

							oNewEntityInstance[""] = oResponse["ID"];
							oNewEntityInstance[""] = sSourceEntityId;
							oModel.createEntry("", {
								properties: oNewEntityInstance
							});
							oModel.submitChanges({
								success: function (oResponse) {
									var oChangeResponse = oResponse.__batchResponses[0].__changeResponses[0];
									if (oChangeResponse && oChangeResponse.response) {
										oModel.resetChanges();
										fnReject(new Error(oChangeResponse.message));
									} else {
										fnResolveAfterRefresh();
									}
								},
								error: function (oError) {
									fnReject(new Error(oError.message));
								}
							});
						} catch (err) {
							var message = typeof err === "string" ? err : err.message;
							fnReject(new Error("Error: " + message));
						}
					}
				}).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err.message);
					}
				});

			},
			_onUploadCollectionChange: function (oEvent) {

				var oUploadCollection = oEvent.getSource();
				var aFiles = oEvent.getParameter('files');

				if (aFiles && aFiles.length) {
					var oFile = aFiles[0];
					var sFileName = oFile.name;

					var oDataModel = this.getView().getModel();
					if (oUploadCollection && sFileName && oDataModel) {
						var sXsrfToken = oDataModel.getSecurityToken();
						var oCsrfParameter = new sap.m.UploadCollectionParameter({
							name: "x-csrf-token",
							value: sXsrfToken
						});
						oUploadCollection.addHeaderParameter(oCsrfParameter);
						var oContentDispositionParameter = new sap.m.UploadCollectionParameter({
							name: "content-disposition",
							value: "inline; filename=\"" + encodeURIComponent(sFileName) + "\""
						});
						oUploadCollection.addHeaderParameter(oContentDispositionParameter);
					} else {
						throw new Error("Not enough information available");
					}
				}

			},
			_onUploadCollectionTypeMissmatch: function () {
				return new Promise(function (fnResolve) {
					sap.m.MessageBox.warning(
						"The file you are trying to upload does not have an authorized file type (JPEG, JPG, GIF, PNG, TXT, PDF, XLSX, DOCX, PPTX).", {
							title: "Invalid File Type",
							onClose: function () {
								fnResolve();
							}
						});
				}).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err);
					}
				});

			},
			_onFileUploaderChange: function () { //start of function for file attachments in array
				var oFileuploader = this.getView().byId("ci_fileUploader1");
				var ci_attach1 = this.getView().byId("UploadCollection");
				var len = oFileuploader.length;
				var sFilename = oFileuploader.getValue();

				var file = jQuery.sap.domById(oFileuploader.getId() + "-fu").files[0];

				var base64_marker = 'data:' + file.type + ';base64,';

				var filename = sFilename.replace(/(\.[^/.]+)+$/, ""); // File Name

				var fileext = sFilename.slice((sFilename.lastIndexOf(".") - 1 >>> 0) + 2); // File Extension

				var sfileext = fileext.substring(0, 3);

				var tsfileext = sfileext.toUpperCase();

				var that = this;
				if (file) {
					var reader = new FileReader();

					reader.onload = function (readerEvt) {
						var binaryString = readerEvt.target.result;
						var base64 = btoa(binaryString);

						oFileuploader.setValue();
						that.baseval.push(base64);

						var ci_obj1 = {
							Name: filename,
							Ext: tsfileext,
							Base64: base64
						};
						that.ci_att1.push(ci_obj1);

						var oModel = new sap.ui.model.json.JSONModel(that.ci_att1);

						ci_attach1.setModel(oModel);
						var oItems = new sap.m.ObjectListItem({
							icon: {
								path: "Ext",
								formatter: function (subject) {
									var lv = subject;
									if (lv === 'TXT') {
										return "sap-icon://document-text";
									} else if (lv === 'JPG' || lv === 'PNG' || lv === 'BMP') {
										return "sap-icon://attachment-photo";
									} else if (lv === 'PDF') {
										return "sap-icon://pdf-attachment";
									} else if (lv === 'DOC') {
										return "sap-icon://doc-attachment";
									} else if (lv === 'XLS') {
										return "sap-icon://excel-attachment";
									} else if (lv === 'MP3') {
										return "sap-icon://attachment-audio";
									} else if (lv === 'XLS') {
										return "sap-icon://excel-attachment";
									} else if (lv === 'PPT') {
										return "sap-icon://ppt-attachment";
									} else {
										return "sap-icon://document";
									}

								}
							},
							title: "{Name}.{Ext}",
							type: "Active"
						});
						ci_attach1.bindItems("/", oItems);
						that.getView().getModel("oGlobalModel").setProperty("/ci_att1", that.ci_att1);

					};

				}

				reader.readAsBinaryString(file);

			}, //end of function for file attachments in array
			_onUploadCollectionFileSizeExceed: function () {
				return new Promise(function (fnResolve) {
					sap.m.MessageBox.warning("The file you are trying to upload is too large (10MB max).", {
						title: "File Too Large",
						onClose: function () {
							fnResolve();
						}
					});
				}).catch(function (err) {
					if (err !== undefined) {
						MessageBox.error(err);
					}
				});

			},
			onUploadComplete: function (oEvent) { //start of function for file uploader

				var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
				setTimeout(function () {
					var oUploadCollection = this.byId("UploadCollection");

					for (var i = 0; i < oUploadCollection.getItems().length; i++) {
						if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
							oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
							break;
						}
					}

					// delay the success message in order to see other messages before
					MessageToast.show("Event uploadComplete triggered");
				}.bind(this), 8000);
			}, //end of function for file uploader
			onChange: function (oEvent) { //start of function for file uploader
				// debugger;
				var oUploadCollection = oEvent.getSource();
				// Header Token
				var oCustomerHeaderToken = new UploadCollectionParameter({
					name: "x-csrf-token",
					value: "securityTokenFromModel"
				});
				oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
				// MessageToast.show("Event change triggered");
			}, //end of function for file uploader
			ci_handleDelete: function (oEvent) { //start of function for deleting fileAttachment from array

				var path = oEvent.getParameter('listItem').getBindingContext().getPath();
				var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
				var list_ID = sap.ui.getCore().byId(oEvent.getSource().sId);
				debugger;
				var Data = list_ID.getModel();

				var d = Data.getData();
				d.splice(idx, 1);
				Data.setData(d);
			}, //end of function for deleting fileAttachment from array
			busyDialogDownloadFun: function () { //start of function for busyDialogFragment loading box while downloading
				// var busyDialog = this.byId("BusyDialog");

				this.busyDialogPost.open();

				jQuery.sap.delayedCall(3000, this, function () {
					this.busyDialogPost.close();
				});
			}, //end of function for busyDialogFragment loading box while downloading
			icontabchange: function (oEvent) {
				var icontab = this.getView().byId("byp");
				var mKey = oEvent.getParameters().key;
				if (mKey === "plantby") {

					var plant = sap.ui.core.Fragment.byId("valueHelpfragment", "plantFrag").setValue("");

					var tableres = sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable");
					tableres.destroyItems();

				} else if (mKey === "typeby") {
					var plant1 = sap.ui.core.Fragment.byId("valueHelpfragment", "materialType").setValue("");
					var tableres1 = sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable");
					tableres1.destroyItems();
				} else if (mKey === "descby") {
					var plant2 = sap.ui.core.Fragment.byId("valueHelpfragment", "materialDesc").setValue("");
					var tableres2 = sap.ui.core.Fragment.byId("valueHelpfragment", "fragTable");
					tableres2.destroyItems();

				}
			},
			onInit: function () {
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.getTarget("Page1").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
				this.valueHelpfragment = sap.ui.xmlfragment("valueHelpfragment", "com.sap.build.standard.createPrGrunt.fragments.valueHelp",
					this);
				this.getView().addDependent(this.valueHelpfragment);
				this.valueHelpEditfragment = sap.ui.xmlfragment("valueHelpEditfragment",
					"com.sap.build.standard.createPrGrunt.fragments.valueHelpEdit",
					this);
				this.getView().addDependent(this.valueHelpEditfragment);
				this.itemTable = sap.ui.xmlfragment("itemTablefragment", "com.sap.build.standard.createPrGrunt.fragments.itemTable",
					this);
				this.getView().addDependent(this.itemTable);
				this.editTable = sap.ui.xmlfragment("editTablefragment", "com.sap.build.standard.createPrGrunt.fragments.editTable",
					this);
				this.getView().addDependent(this.editTable);
				this.busyDialogPost = sap.ui.xmlfragment("busyDialogPostfragment", "com.sap.build.standard.createPrGrunt.fragments.busyDialogPost",
					this);
				this.getView().addDependent(this.busyDialogPost);

				this.returnMessageTable = sap.ui.xmlfragment("returnMessagefragment", "com.sap.build.standard.createPrGrunt.fragments.returnMessage",
					this);
				this.getView().addDependent(this.returnMessageTable);

			}
		});
	},
	/* bExport= */
	true);