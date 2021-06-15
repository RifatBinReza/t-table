/**
 * @author Rifat Bin Reza <rifatbinreza@gmail.com>
 * version: 0.3
 * https://github.com/RifatBinReza/t-table/
 */


class Renderer {
	constructor(tableEl, originalTableEl) {
		this.tableEl = tableEl
		this.originalTableEl = originalTableEl
	}

	setData(processedData) {
		this.processedData = processedData
	}

	renderTable() {
		this.renderTableHeader();
		this.renderTableData();
		this.renderTableFooter();
		this.renderFooterController();
	}


	renderTableHeader() {
		let header = this.processedData.header

		let thead = document.createElement('thead');
		thead.classList.add('r-thead');

		let tr = document.createElement('tr');
		tr.classList.add('r-thead-tr');

		for (let i = 0; i < header.length; i++) {
			let th = document.createElement('th');
			th.classList.add('r-thead-tr-th');
			th.appendChild(document.createTextNode(header[i].name));
			if (header[i].sortable) {
				let btn = document.createElement('button')
				btn.classList.add('sortable-btn')
				btn.appendChild(document.createTextNode('^'))
				th.appendChild(btn)
				// We can add the event here
			}
			tr.appendChild(th);
		}
		thead.appendChild(tr);
		this.tableEl.appendChild(thead);
	}

	renderTableData() {
		let currentPageData = this.processedData.currentPageData
		let header = this.processedData.header
		let tbody = this.getTbody()

		for (let i = 0; i < currentPageData.length; i++) {
			let tr = document.createElement('tr')
			tr.classList.add('r-tbody-tr')

			for (let j = 0; j < header.length; j++) {
				let td = document.createElement('td')
				td.classList.add('r-tbody-tr-td')

				// td.appendChild(document.createTextNode(this.currentPageData[i][j]));
				td.innerHTML = currentPageData[i][header[j].key]
				tr.appendChild(td);
			}
			tbody.appendChild(tr)
		}
	}


	renderTableFooter() {
		let tfoot = this.getTableFooterEl();
		// this.processedData.footer = this.getTableFooterData();
		let footerData = this.processedData.footer
		let currentPageData = this.processedData.currentPageData;

		let tr = document.createElement('tr');
		tr.classList.add('r-tfoot-tr');

		for (let i = 0; i < footerData.length; i++) {
			let th = document.createElement('th');
			th.classList.add('r-tfoot-tr-th');

			if (footerData[i].render) {
				th.appendChild(document.createTextNode(footerData[i].render(currentPageData)));
			} else {
				th.appendChild(document.createTextNode(footerData[i].text));
			}

			th.setAttribute('colspan', footerData[i].colspan);
			th.setAttribute('rowspan', footerData[i].rowspan);

			if (footerData[i].colspan > 1) {
				th.classList.add('r-text-right');
			}
			tr.appendChild(th);
		}

		tfoot.appendChild(tr);
		this.tableEl.appendChild(tfoot);
	}

	renderHeaderController() {
		let headerControllerEl = this.getHeaderControllerEl();

	}

	renderFooterController() {
		this.renderFooterPagination();
	}

	renderFooterPagination() {
		let paginationUL = this.getPaginationUL();
		let currentPagination = this.processedData.currentPagination
		for (let i = 0; i < currentPagination.paginationArr.length; i++) {
			let paginationLI = document.createElement('li');
			let a = document.createElement('a');
			a.setAttribute('href', '#');

			if (currentPagination.paginationArr[i].index == -2) {
				paginationLI.setAttribute('id', 'r-previous-page-button');
				a.classList.add('r-disabled');
				a.innerText = '<';
			} else if (currentPagination.paginationArr[i].index == -1) {
				paginationLI.setAttribute('id', 'r-next-page-button');
				a.innerText = '>'
			} else if (currentPagination.paginationArr[i].index == 0){
				a.classList.add('r-selected');
				a.innerText = i;
				a.setAttribute('page-number', currentPagination.paginationArr[i].index);
			} else if (currentPagination.paginationArr[i].label == '...') {
				a.innerText = '...'
				a.setAttribute('page-number', '...');
				a.setAttribute('disabled', true);
			} else {
				a.innerText = i;
				a.setAttribute('page-number', currentPagination.paginationArr[i].index);
			}
			paginationLI.appendChild(a);
			paginationUL.appendChild(paginationLI);
		}
		this.footerControllerEl.appendChild(paginationUL);
	}

	renderCustomFunctions() {
		this.renderColumnFunctions();
	}

	renderColumnFunctions() {
		let columns = this.processedData.columns
		let currentPageData = this.processedData.currentPageData

		this.resetDataToOriginal();
		for (let i = 0; i < columns.length; i++) {
			if (columns[i].render) {
				for (let j = 0; j < currentPageData.length; j++) {
					let data = currentPageData[j][i];
					let row = currentPageData[j];
					currentPageData[j][i] = columns[i].render(data, row);
				}
			}
		}
	}

	getTableEl() {
		if (!this.tableEl) {
			this.tableParentEl = document.createElement('div');
			this.tableParentEl.classList.add('r-table');

			this.tableEl = document.createElement('table');
			this.tableEl.setAttribute('id', this.tableId);

			this.tableParentEl.appendChild(this.tableEl);
			return this.tableEl;
		} else {
			return this.tableEl;
		}
	}

	getPaginationUL() {
		if (!this.paginationContainerEl) {
			this.paginationContainerEl = document.createElement('div');
			this.paginationContainerEl.classList.add('r-pagination');

			this.paginationUL = document.createElement('ul');
			this.paginationUL.classList.add('r-pagination-ul');
			this.paginationUL.setAttribute('id', 'r-pagination-ul');

			this.paginationContainerEl.appendChild(this.paginationUL);
			return this.paginationUL;
		} else {
			return this.paginationUL;
		}
	}

	getTableFooterEl() {
		if (!this.tfooter) {
			this.tfooter = document.createElement('tfoot');
			this.tableEl.appendChild(this.tfooter);
			this.tfooter.classList.add('r-tfoot');
			return this.tfooter;
		} else {
			while (this.tfooter.firstChild) {
				this.tfooter.removeChild(this.tfooter.lastChild);	
			}
			return this.tfooter;
		}
	}

	getTableFooterData() {
		return this.processedData.footer
	}

	getHeaderControllerEl() {
		if (!this.headerControllerEl) {
			this.headerControllerEl = document.createElement('div');

			this.headerControllerEl.classList.add('r-header-controller');
			return this.headerControllerEl;
		} else {
			return this.headerControllerEl;
		}
	}

	getFooterControllerEl() {
		if (!this.footerControllerEl) {
			this.footerControllerEl = document.createElement('div');
			this.footerControllerEl.classList.add('r-footer-controller');
			return this.footerControllerEl;
		} else {
			return this.footerControllerEl;
		}
	}
	initContainer() {
		this.tableContainer = this.getTableContainer();
		this.replaceOriginalTableWithTableContainer();
		this.tableContainer.appendChild(this.getHeaderControllerEl());
		this.tableContainer.appendChild(this.getTableEl());
		this.tableContainer.appendChild(this.getFooterControllerEl());
	}

	getTableContainer() {
		if (!this.tableContainer) {
			this.tableContainer = document.createElement('div');
			this.tableContainer.classList.add('table-container');
			this.tableContainer.setAttribute('id', 'table-container');
			return this.tableContainer;
		} else {
			return this.tableContainer;
		}
	}

	getTbody() {
		if (!this.tbody) {
			this.tbody = document.createElement('tbody');
			this.tableEl.appendChild(this.tbody);
			this.tbody.classList.add('r-tbody');
			return this.tbody;
		} else {
			while (this.tbody.firstChild) {
				this.tbody.removeChild(this.tbody.lastChild);	
			}
			return this.tbody;
		}
	}
	
	replaceOriginalTableWithTableContainer() {
		this.originalTableEl.parentNode.replaceChild(this.tableContainer, this.originalTableEl);
	}

	resetDataToOriginal() {
		this.processedData.groupData = this.processedData.getTableDataGroups();
		this.processedData.currentPageData = this.processedData.groupData[this.processedData.currentPageNumber];
	}

}