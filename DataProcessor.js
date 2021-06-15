/**
 * @author Rifat Bin Reza <rifatbinreza@gmail.com>
 * version: 0.3
 * https://github.com/RifatBinReza/t-table/
 */


class DataProcessor {
	constructor(options) {
		this.sourceData = options.data
		this.processInitialData(options)
		this.validateData()
	}

	processInitialData(options) {
		let self = this
		this.columns = options.columns
		this.rowPerPage = options.rowPerPage
		this.header = options.columns.map(function (col) {
			return {
				src: col.src ? col.src : '',
				key: col.name ? self.makeKey(col.name) : '',
				name: col.name,
				sortable: col.sortable ? true : false
			}
		})
		this.footer = options.footer
		this.currentPageNumber = options.currentPageNumber
	}

	initiateCurrentPagination() {
		let totalPage = Math.ceil(this.totalData/this.rowPerPage)
		let i = 0
		let includeDots = false
		if (totalPage > 9) {
			totalPage = 9
			includeDots = true
		}
		let paginationArr = [{
			index: -2,
			label: '<'
		}]
		while (i < totalPage) {
			if(includeDots && i == 4) {
				paginationArr.push({
					index: i, label: '...'
				})	
			} else {
				paginationArr.push({
					index: i, label: i+1
				})
			}
			i++
		}
		paginationArr.push({
			index: -1,
			label: '>'
		})
		this.currentPagination = {
			paginationArr
		}
	}

	getData() {
		return this.data;
	}

	getProcessedData() {
		return this.processedData;
	}

	makeKey(name) {
		return name.toLowerCase().replace(/ /g,"_")
	}

	validateData() {
		if (Object.prototype.toString.call(this.sourceData) == '[object Array]') {
			if (this.sourceData.length < 1) {
				console.log('DataProcessor.validateData() - Empty array')
			}
			if (Object.prototype.toString.call(this.sourceData[0]) == '[object Array]') {
				this.setDataType('Array');
			} else if (Object.prototype.toString.call(this.sourceData[0]) == '[object Object]') {
				this.setDataType('Object');
			} else {
				console.log('DataProcessor.validateData() - Invalid array elements')
			}
		} else {
			console.log('DataProcessor.validateData() - Not an array')
		}
	}

	setDataType(type) {
		this.dataType = type;
	}

	getDataType() {
		return this.dataType;
	}

	processData() {
		switch (this.getDataType()) {
			case 'Array' :
				this.processArrayData();
			break;
			case 'Object' :
				this.processObjectData();
			break;
			default :
				console.log('DataProcessor.processData() - Data not a valid type')
			break;
		}

		this.totalData = this.data.length

		this.processGroupData()
		this.initiateCurrentPagination()

		this.processedData = {
			columnNames: this.columnNames,
			columnKeys: this.columnKeys,
			data: this.data,
			columnSrcs: this.columnSrcs,
			columnKeys: this.columnKeys,
			header: this.header,
			footer: this.footer,
			currentPageNumber: this.currentPageNumber,
			currentPageData: this.groupData[this.currentPageNumber],
			groupData: this.groupData,
			currentPagination: this.currentPagination,
			totalData: this.totalData
		}
	}

	processGroupData() {
		let i, j, data = [];
		// Make a deep copy otherwise the original reference will be changed
		let tempData = JSON.parse(JSON.stringify(this.data))
		for (i = 0, j = tempData.length; i < j; i += this.rowPerPage) {
		    let tempArray = tempData.slice(i, i + this.rowPerPage);
		    data.push(tempArray);
		}
		this.groupData = data;
	}

	getCurrentPageData() {
		return this.currentPageData
	}

	setCurrentPageData(fromIndex, toIndex) {
		this.currentPageData = this.data.slice(fromIndex, toIndex)
	}

	getTableDataGroups() {
		return this.groupData
	}

	getObjectByProperty(obj, prop, defval) {
		if (typeof defval == 'undefined') defval = null;
	    prop = prop.split('.');
	    for (var i = 0; i < prop.length; i++) {
	        if(typeof obj[prop[i]] == 'undefined')
	            return defval;
	        obj = obj[prop[i]];
	    }
	    return obj;
	}

	processArrayData() {
		let self = this
		this.data = this.sourceData.map(function(row, rowIndex) {
			let newRow = {_id:rowIndex}
			for (let i = 0; i < self.header.length; i++) {
				if (self.columns[i].render) {
					newRow[self.header[i].key] = self.columns[i].render(row[i], row)
				} else {
					newRow[self.header[i].key] = row[i]
				}
			}
			return newRow
		})
	}

	processObjectData() {
		let self = this
		this.data = this.sourceData.map(function(row, rowIndex) {
			let newRow = {_id:rowIndex}
			for (let i = 0; i < self.columnKeys.length; i++) {
				if (self.columns[i].render && self.columnSrcs[i]) {
					newRow[self.columnKeys[i]] = self.columns[i].render(self.getObjectByProperty(row, self.columnSrcs[i]), row)
				} else if (self.columns[i].render && !self.columnSrcs[i]) {
					newRow[self.columnKeys[i]] = self.columns[i].render(row, row)
				} else {
					newRow[self.columnKeys[i]] = self.getObjectByProperty(row, self.columnSrcs[i])
				}
			}
			return newRow
		})
	}
}

var arrayData = [
    [
      "Tiger Nixon",
      "System Architect",
      "Edinburgh",
      "5421",
      "2011/04/25",
      "$320,800"
    ],
    [
      "Garrett Winters",
      "Accountant",
      "Tokyo",
      "8422",
      "2011/07/25",
      "$170,750"
    ],
    [
      "Ashton Cox",
      "Junior Technical Author",
      "San Francisco",
      "1562",
      "2009/01/12",
      "$86,000"
    ],
    [
      "Cedric Kelly",
      "Senior Javascript Developer",
      "Edinburgh",
      "6224",
      "2012/03/29",
      "$433,060"
    ],
    [
      "Airi Satou",
      "Accountant",
      "Tokyo",
      "5407",
      "2008/11/28",
      "$162,700"
    ],
    [
      "Brielle Williamson",
      "Integration Specialist",
      "New York",
      "4804",
      "2012/12/02",
      "$372,000"
    ],
    [
      "Herrod Chandler",
      "Sales Assistant",
      "San Francisco",
      "9608",
      "2012/08/06",
      "$137,500"
    ],
    [
      "Rhona Davidson",
      "Integration Specialist",
      "Tokyo",
      "6200",
      "2010/10/14",
      "$327,900"
    ],
    [
      "Colleen Hurst",
      "Javascript Developer",
      "San Francisco",
      "2360",
      "2009/09/15",
      "$205,500"
    ],
    [
      "Sonya Frost",
      "Software Engineer",
      "Edinburgh",
      "1667",
      "2008/12/13",
      "$103,600"
    ],
    [
      "Jena Gaines",
      "Office Manager",
      "London",
      "3814",
      "2008/12/19",
      "$90,560"
    ],
    [
      "Quinn Flynn",
      "Support Lead",
      "Edinburgh",
      "9497",
      "2013/03/03",
      "$342,000"
    ],
    [
      "Charde Marshall",
      "Regional Director",
      "San Francisco",
      "6741",
      "2008/10/16",
      "$470,600"
    ],
    [
      "Haley Kennedy",
      "Senior Marketing Designer",
      "London",
      "3597",
      "2012/12/18",
      "$313,500"
    ],
    [
      "Tatyana Fitzpatrick",
      "Regional Director",
      "London",
      "1965",
      "2010/03/17",
      "$385,750"
    ],
    [
      "Michael Silva",
      "Marketing Designer",
      "London",
      "1581",
      "2012/11/27",
      "$198,500"
    ],
    [
      "Paul Byrd",
      "Chief Financial Officer (CFO)",
      "New York",
      "3059",
      "2010/06/09",
      "$725,000"
    ],
    [
      "Gloria Little",
      "Systems Administrator",
      "New York",
      "1721",
      "2009/04/10",
      "$237,500"
    ],
    [
      "Bradley Greer",
      "Software Engineer",
      "London",
      "2558",
      "2012/10/13",
      "$132,000"
    ],
    [
      "Dai Rios",
      "Personnel Lead",
      "Edinburgh",
      "2290",
      "2012/09/26",
      "$217,500"
    ],
    [
      "Jenette Caldwell",
      "Development Lead",
      "New York",
      "1937",
      "2011/09/03",
      "$345,000"
    ],
    [
      "Yuri Berry",
      "Chief Marketing Officer (CMO)",
      "New York",
      "6154",
      "2009/06/25",
      "$675,000"
    ],
    [
      "Caesar Vance",
      "Pre-Sales Support",
      "New York",
      "8330",
      "2011/12/12",
      "$106,450"
    ],
    [
      "Doris Wilder",
      "Sales Assistant",
      "Sydney",
      "3023",
      "2010/09/20",
      "$85,600"
    ],
    [
      "Angelica Ramos",
      "Chief Executive Officer (CEO)",
      "London",
      "5797",
      "2009/10/09",
      "$1,200,000"
    ],
    [
      "Gavin Joyce",
      "Developer",
      "Edinburgh",
      "8822",
      "2010/12/22",
      "$92,575"
    ],
    [
      "Jennifer Chang",
      "Regional Director",
      "Singapore",
      "9239",
      "2010/11/14",
      "$357,650"
    ],
    [
      "Brenden Wagner",
      "Software Engineer",
      "San Francisco",
      "1314",
      "2011/06/07",
      "$206,850"
    ],
    [
      "Fiona Green",
      "Chief Operating Officer (COO)",
      "San Francisco",
      "2947",
      "2010/03/11",
      "$850,000"
    ],
    [
      "Shou Itou",
      "Regional Marketing",
      "Tokyo",
      "8899",
      "2011/08/14",
      "$163,000"
    ],
    [
      "Michelle House",
      "Integration Specialist",
      "Sydney",
      "2769",
      "2011/06/02",
      "$95,400"
    ],
    [
      "Suki Burks",
      "Developer",
      "London",
      "6832",
      "2009/10/22",
      "$114,500"
    ],
    [
      "Prescott Bartlett",
      "Technical Author",
      "London",
      "3606",
      "2011/05/07",
      "$145,000"
    ],
    [
      "Gavin Cortez",
      "Team Leader",
      "San Francisco",
      "2860",
      "2008/10/26",
      "$235,500"
    ],
    [
      "Martena Mccray",
      "Post-Sales support",
      "Edinburgh",
      "8240",
      "2011/03/09",
      "$324,050"
    ],
    [
      "Unity Butler",
      "Marketing Designer",
      "San Francisco",
      "5384",
      "2009/12/09",
      "$85,675"
    ],
    [
      "Howard Hatfield",
      "Office Manager",
      "San Francisco",
      "7031",
      "2008/12/16",
      "$164,500"
    ],
    [
      "Hope Fuentes",
      "Secretary",
      "San Francisco",
      "6318",
      "2010/02/12",
      "$109,850"
    ],
    [
      "Vivian Harrell",
      "Financial Controller",
      "San Francisco",
      "9422",
      "2009/02/14",
      "$452,500"
    ],
    [
      "Timothy Mooney",
      "Office Manager",
      "London",
      "7580",
      "2008/12/11",
      "$136,200"
    ],
    [
      "Jackson Bradshaw",
      "Director",
      "New York",
      "1042",
      "2008/09/26",
      "$645,750"
    ],
    [
      "Olivia Liang",
      "Support Engineer",
      "Singapore",
      "2120",
      "2011/02/03",
      "$234,500"
    ],
    [
      "Bruno Nash",
      "Software Engineer",
      "London",
      "6222",
      "2011/05/03",
      "$163,500"
    ],
    [
      "Sakura Yamamoto",
      "Support Engineer",
      "Tokyo",
      "9383",
      "2009/08/19",
      "$139,575"
    ],
    [
      "Thor Walton",
      "Developer",
      "New York",
      "8327",
      "2013/08/11",
      "$98,540"
    ],
    [
      "Finn Camacho",
      "Support Engineer",
      "San Francisco",
      "2927",
      "2009/07/07",
      "$87,500"
    ],
    [
      "Serge Baldwin",
      "Data Coordinator",
      "Singapore",
      "8352",
      "2012/04/09",
      "$138,575"
    ],
    [
      "Zenaida Frank",
      "Software Engineer",
      "New York",
      "7439",
      "2010/01/04",
      "$125,250"
    ],
    [
      "Zorita Serrano",
      "Software Engineer",
      "San Francisco",
      "4389",
      "2012/06/01",
      "$115,000"
    ],
    [
      "Jennifer Acosta",
      "Junior Javascript Developer",
      "Edinburgh",
      "3431",
      "2013/02/01",
      "$75,650"
    ],
    [
      "Cara Stevens",
      "Sales Assistant",
      "New York",
      "3990",
      "2011/12/06",
      "$145,600"
    ],
    [
      "Hermione Butler",
      "Regional Director",
      "London",
      "1016",
      "2011/03/21",
      "$356,250"
    ],
    [
      "Lael Greer",
      "Systems Administrator",
      "London",
      "6733",
      "2009/02/27",
      "$103,500"
    ],
    [
      "Jonas Alexander",
      "Developer",
      "San Francisco",
      "8196",
      "2010/07/14",
      "$86,500"
    ],
    [
      "Shad Decker",
      "Regional Director",
      "Edinburgh",
      "6373",
      "2008/11/13",
      "$183,000"
    ],
    [
      "Michael Bruce",
      "Javascript Developer",
      "Singapore",
      "5384",
      "2011/06/27",
      "$183,000"
    ],
    [
      "Donna Snider",
      "Customer Support",
      "New York",
      "4226",
      "2011/01/25",
      "$112,000"
    ]
]

var objectData = [
    {
      "DT_RowId": "row_1",
      "users": {
        "first_name": "Quynn",
        "last_name": "Contreras",
        "phone": "1-971-977-4681",
        "site": "1"
      },
      "sites": {
        "name": "Edinburgh"
      }
    },
    {
      "DT_RowId": "row_2",
      "users": {
        "first_name": "Kaitlin",
        "last_name": "Smith",
        "phone": "1-436-523-6103",
        "site": "2"
      },
      "sites": {
        "name": "London"
      }
    },
    {
      "DT_RowId": "row_3",
      "users": {
        "first_name": "Cruz",
        "last_name": "Reynolds",
        "phone": "1-776-102-6352",
        "site": "3"
      },
      "sites": {
        "name": "Paris"
      }
    },
    {
      "DT_RowId": "row_4",
      "users": {
        "first_name": "Sophia",
        "last_name": "Morris",
        "phone": "1-463-224-1405",
        "site": "4"
      },
      "sites": {
        "name": "New York"
      }
    },
    {
      "DT_RowId": "row_5",
      "users": {
        "first_name": "Kamal",
        "last_name": "Roberson",
        "phone": "1-134-408-5227",
        "site": "5"
      },
      "sites": {
        "name": "Singapore"
      }
    },
    {
      "DT_RowId": "row_6",
      "users": {
        "first_name": "Dustin",
        "last_name": "Rosa",
        "phone": "1-875-919-3188",
        "site": "6"
      },
      "sites": {
        "name": "Los Angeles"
      }
    },
    {
      "DT_RowId": "row_7",
      "users": {
        "first_name": "Xantha",
        "last_name": "George",
        "phone": "1-106-884-4754",
        "site": "1"
      },
      "sites": {
        "name": "Edinburgh"
      }
    },
    {
      "DT_RowId": "row_8",
      "users": {
        "first_name": "Bryar",
        "last_name": "Long",
        "phone": "1-918-114-8083",
        "site": "2"
      },
      "sites": {
        "name": "London"
      }
    },
    {
      "DT_RowId": "row_9",
      "users": {
        "first_name": "Kuame",
        "last_name": "Wynn",
        "phone": "1-101-692-4039",
        "site": "3"
      },
      "sites": {
        "name": "Paris"
      }
    },
    {
      "DT_RowId": "row_10",
      "users": {
        "first_name": "Indigo",
        "last_name": "Brennan",
        "phone": "1-756-756-8161",
        "site": "4"
      },
      "sites": {
        "name": "New York"
      }
    },
    {
      "DT_RowId": "row_11",
      "users": {
        "first_name": "Avram",
        "last_name": "Allison",
        "phone": "1-751-507-2640",
        "site": "5"
      },
      "sites": {
        "name": "Singapore"
      }
    },
    {
      "DT_RowId": "row_12",
      "users": {
        "first_name": "Martha",
        "last_name": "Burgess",
        "phone": "1-971-722-1203",
        "site": "6"
      },
      "sites": {
        "name": "Los Angeles"
      }
    },
    {
      "DT_RowId": "row_13",
      "users": {
        "first_name": "Lael",
        "last_name": "Kim",
        "phone": "1-626-697-2194",
        "site": "1"
      },
      "sites": {
        "name": "Edinburgh"
      }
    },
    {
      "DT_RowId": "row_14",
      "users": {
        "first_name": "Lyle",
        "last_name": "Lewis",
        "phone": "1-231-793-3520",
        "site": "2"
      },
      "sites": {
        "name": "London"
      }
    },
    {
      "DT_RowId": "row_15",
      "users": {
        "first_name": "Veronica",
        "last_name": "Marks",
        "phone": "1-750-981-6759",
        "site": "3"
      },
      "sites": {
        "name": "Paris"
      }
    },
    {
      "DT_RowId": "row_16",
      "users": {
        "first_name": "Wynne",
        "last_name": "Ruiz",
        "phone": "1-983-744-5362",
        "site": "4"
      },
      "sites": {
        "name": "New York"
      }
    },
    {
      "DT_RowId": "row_17",
      "users": {
        "first_name": "Jessica",
        "last_name": "Bryan",
        "phone": "1-949-932-6772",
        "site": "5"
      },
      "sites": {
        "name": "Singapore"
      }
    },
    {
      "DT_RowId": "row_18",
      "users": {
        "first_name": "Quinlan",
        "last_name": "Hyde",
        "phone": "1-625-664-6072",
        "site": "6"
      },
      "sites": {
        "name": "Los Angeles"
      }
    },
    {
      "DT_RowId": "row_19",
      "users": {
        "first_name": "Mona",
        "last_name": "Terry",
        "phone": "1-443-179-7343",
        "site": "1"
      },
      "sites": {
        "name": "Edinburgh"
      }
    },
    {
      "DT_RowId": "row_20",
      "users": {
        "first_name": "Medge",
        "last_name": "Patterson",
        "phone": "1-636-979-0497",
        "site": "2"
      },
      "sites": {
        "name": "London"
      }
    },
    {
      "DT_RowId": "row_21",
      "users": {
        "first_name": "Perry",
        "last_name": "Gamble",
        "phone": "1-440-976-9560",
        "site": "3"
      },
      "sites": {
        "name": "Paris"
      }
    },
    {
      "DT_RowId": "row_22",
      "users": {
        "first_name": "Pandora",
        "last_name": "Armstrong",
        "phone": "1-197-431-4390",
        "site": "4"
      },
      "sites": {
        "name": "New York"
      }
    },
    {
      "DT_RowId": "row_23",
      "users": {
        "first_name": "Pandora",
        "last_name": "Briggs",
        "phone": "1-278-288-9221",
        "site": "5"
      },
      "sites": {
        "name": "Singapore"
      }
    },
    {
      "DT_RowId": "row_24",
      "users": {
        "first_name": "Maris",
        "last_name": "Leblanc",
        "phone": "1-936-114-2921",
        "site": "6"
      },
      "sites": {
        "name": "Los Angeles"
      }
    },
    {
      "DT_RowId": "row_25",
      "users": {
        "first_name": "Ishmael",
        "last_name": "Crosby",
        "phone": "1-307-243-2684",
        "site": "1"
      },
      "sites": {
        "name": "Edinburgh"
      }
    },
    {
      "DT_RowId": "row_26",
      "users": {
        "first_name": "Quintessa",
        "last_name": "Pickett",
        "phone": "1-801-122-7471",
        "site": "2"
      },
      "sites": {
        "name": "London"
      }
    },
    {
      "DT_RowId": "row_27",
      "users": {
        "first_name": "Ifeoma",
        "last_name": "Mays",
        "phone": "1-103-883-0962",
        "site": "3"
      },
      "sites": {
        "name": "Paris"
      }
    },
    {
      "DT_RowId": "row_28",
      "users": {
        "first_name": "Basia",
        "last_name": "Harrell",
        "phone": "1-528-238-4178",
        "site": "4"
      },
      "sites": {
        "name": "New York"
      }
    },
    {
      "DT_RowId": "row_29",
      "users": {
        "first_name": "Hamilton",
        "last_name": "Blackburn",
        "phone": "1-676-857-1423",
        "site": "5"
      },
      "sites": {
        "name": "Singapore"
      }
    },
    {
      "DT_RowId": "row_30",
      "users": {
        "first_name": "Dexter",
        "last_name": "Burton",
        "phone": "1-275-332-8186",
        "site": "6"
      },
      "sites": {
        "name": "Los Angeles"
      }
    },
    {
      "DT_RowId": "row_31",
      "users": {
        "first_name": "Quinn",
        "last_name": "Mccall",
        "phone": "1-808-916-4497",
        "site": "1"
      },
      "sites": {
        "name": "Edinburgh"
      }
    },
    {
      "DT_RowId": "row_32",
      "users": {
        "first_name": "Alexa",
        "last_name": "Wilder",
        "phone": "1-727-307-1997",
        "site": "2"
      },
      "sites": {
        "name": "London"
      }
    },
    {
      "DT_RowId": "row_33",
      "users": {
        "first_name": "Rhonda",
        "last_name": "Harrell",
        "phone": "1-934-906-6474",
        "site": "3"
      },
      "sites": {
        "name": "Paris"
      }
    },
    {
      "DT_RowId": "row_34",
      "users": {
        "first_name": "Jocelyn",
        "last_name": "England",
        "phone": "1-826-860-7773",
        "site": "4"
      },
      "sites": {
        "name": "New York"
      }
    },
    {
      "DT_RowId": "row_35",
      "users": {
        "first_name": "Vincent",
        "last_name": "Banks",
        "phone": "1-225-418-0941",
        "site": "5"
      },
      "sites": {
        "name": "Singapore"
      }
    },
    {
      "DT_RowId": "row_36",
      "users": {
        "first_name": "Stewart",
        "last_name": "Chan",
        "phone": "1-781-793-2340",
        "site": "6"
      },
      "sites": {
        "name": "Los Angeles"
      }
    }
]

var jsonData = [
    {
        "name":       "Tiger Nixon",
        "position":   "System Architect",
        "salary":     "$3,120",
        "start_date": "2011/04/25",
        "office":     "Edinburgh",
        "extn":       "5421"
    },
    {
        "name":       "Garrett Winters",
        "position":   "Director",
        "salary":     "$5,300",
        "start_date": "2011/07/25",
        "office":     "Edinburgh",
        "extn":       "8422"
    }
]