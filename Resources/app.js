// this sets the background color of the master UIView (when there are no windows/tab groups on it)

var iPhone = Ti.Platform.osname == "iphone";
var android = Ti.Platform.osname == "android";

var db1 = Titanium.Database.open('mydb');
//creates the columns for the db, we have id, and name for the item that we are deciding to show in the row
db1.execute('CREATE TABLE IF NOT EXISTS my_table(' + 'id INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT, CHECKIT TEXT' + ')');

if (iPhone) {
	//top layer window, nothing actually inside here
	var container = Titanium.UI.createWindow({
		title : 'Shop Listed v1.0',
		backgroundColor : '#fff'
	});
}

//this is the top layer window that we see
var mainWindow = Titanium.UI.createWindow({
	backgroundColor : iPhone ? '#FFF' : 'black',
	title : 'Shop Listed v1.0',
	fullscreen : false
});

if (iPhone) {
	//the navigation between windows
	var nav = Titanium.UI.iPhone.createNavigationGroup({
		window : mainWindow
	});
	container.add(nav);
	//open the top layer container which holds the nav and mainWindow
	container.open();
}

//opens the mainWindow in android instead of the nav group in iPhone
if (android) {
	mainWindow.open();
}

var shoppingListData = [{
	title : "My Shopping List"
}];

var shoppingListTable = Titanium.UI.createTableView({
	data : shoppingListData
});

mainWindow.add(shoppingListTable);

function MyWindow(_event) {
	//creates a window dynamically when a row is clicked
	var win2 = Ti.UI.createWindow({

		backgroundColor : iPhone ? '#FFF' : 'black',
		//gives the title to the next window being made depending on the rowData
		title : _event.rowData.title,
		fullscreen : false
	})

	//this data will have the specific items which can be added
	var data1 = [{
		title : 'Insert New Item',
		name : '1'
	}, {
		title : 'Delete All',
		name : '2'
	}];
	var table1 = Ti.UI.createTableView({
		data : data1
	});

	win2.addEventListener('open', function() {
		alert('window open');
	});
	//create the first database here for shopping list1
	//mydb is the liteSQL to use for small apps if you want to make your own (i think)
	//.open makes a new db, .install would import one from a file

	//function made to extract info from database in order to refresh the shopping list with the rows showing the entered item names
	function refresh() {
		// executes select all from my_table
		var shoppingListRS = db1.execute('SELECT * FROM my_table ');
		//instantiates an array called tableData
		var tableData = [];
		//pushes already existing 'Insert New Item' row to the new tableView
		tableData.push({
			title : 'Insert New Item',
			name : '1'
		});
		//while loop for the shoppingList db execute statement
		while (shoppingListRS.isValidRow()) {
			//selects id from table using above db1.execute statement
			var itemId = shoppingListRS.fieldByName('id');
			var itemName = shoppingListRS.fieldByName('NAME');
			var check = shoppingListRS.fieldByName('CHECKIT');
			shoppingListRS.next();

			//object created so that we can fill tableData array with appropriate format
			var bjc = {
				title : itemName,
				id : itemId,
				hasCheck : check == 'true'
			};
			//remember tableData is the array that is holding the data from the SQL db
			tableData.push(bjc);

		}

		tableData.push({
			title : 'Delete All',
			name : '2'
		});
		//table1 was the original table view so we update it everytime we run refresh with the new tableData array we just made
		table1.data = tableData;

		shoppingListRS.close();

	}

	refresh();

	table1.addEventListener('click', function(e) {
		Ti.API.info(e.rowData.id);

		switch (e.rowData.title) {
			case 'Insert New Item':
				var row = table1.getIndexByName('1');
				data = {
					title : 'New Item'
				};
				table1.insertRowAfter(row, data, {
					animationStyle : Titanium.UI.iPhone.RowAnimationStyle.DOWN
				});

				break;

			case 'New Item':
				var win3 = Ti.UI.createWindow({
					backgroundColor : iPhone ? '#FFF' : 'black',
					exitOnClose : true,
					fullscreen : false,
					layout : 'vertical',
					title : 'Add Item',
					fullscreen : false
				});

				var textField = Ti.UI.createTextField({
					color : '#336699',
					height : 40,
					top : 35,
					left : 35,
					width : 250,
					borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
				});

				win3.add(textField);

				if (android) {
					win3.open();
					//add navigation to the textfield window
				}

				if (iPhone) {
					//window nav to textfield window
					nav.open(win3);
				}

				//this is the save button
				var b1 = Titanium.UI.createButton({
					title : 'Save Item',
					width : 200,
					height : 40,
					top : 35
				});
				win3.add(b1);
				//event listener for save button
				//this button is supposed to fill the
				b1.addEventListener('click', function(e) {
					db1.execute('INSERT INTO my_table (NAME) VALUES(?)', textField.value);

					var rows = db1.execute('SELECT * FROM my_table');
					Titanium.API.info('ROW COUNT = ' + rows.getRowCount());

					if (android) {
						win3.close();
						//add close window and go back functionality for going back from textfield after save button is pressed
					}

					if (iPhone) {
						nav.close(win3);
					}
					refresh();
				});
				break;
			case 'Delete All':

				var a = Titanium.UI.createAlertDialog({

				});

				a.title = 'Alert', a.message = 'Are you sure you want to delete your shopping list?', a.buttonNames = ['OK', 'Cancel'];
				a.cancel = 1;
				a.show();

				a.addEventListener('click', function(e) {
					//alert(JSON.stringify(e));
					if (e.index == 0) {
						//alert(JSON.stringify(e));
						db1.execute('DELETE FROM my_table');
						refresh();
					}

				});
				break;

			default:

				var id = e.rowData.id

				var checkRS = db1.execute('SELECT CHECKIT FROM my_table WHERE id = ?', id);
				var checked = checkRS.fieldByName('CHECKIT');

				if (checked == 'true') {
					db1.execute('UPDATE my_table SET CHECKIT = ? WHERE ID = ?', '', id);
				} else {
					db1.execute('UPDATE my_table SET CHECKIT = ? WHERE ID = ?', 'true', id);
				}

				refresh();

				break;
		}

	});

	win2.add(table1);

	return win2;
}

//always listening for the click on any row in shopping list table
shoppingListTable.addEventListener('click', function(_event) {

	var nextWindow = MyWindow(_event);

	if (android) {
		nextWindow.open();
	}

	if (iPhone) {
		nav.open(nextWindow);
	}

})