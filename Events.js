/**
 * @author Rifat Bin Reza <rifatbinreza@gmail.com>
 * version: 0.3
 * https://github.com/RifatBinReza/t-table
 */


class Events {
	constructor() {

	}

	setData(processedData) {
		this.processedData = processedData
	}

	setRenderer(renderer) {
		this.renderer = renderer
	}

	registerPagination() {
		let paginationButtons = document.querySelectorAll('.r-pagination-ul > li > a');
		let self = this;
		let prevAEl = document.getElementById('r-previous-page-button').children[0]
		let nextAEl = document.getElementById('r-next-page-button').children[0]
		paginationButtons.forEach( function (a) {
			a.addEventListener('click', function (event) {
				let pageEl = event.target;
				let currentSelectedEl = document.querySelectorAll('.r-pagination-ul > li > .r-selected')[0];
				if (pageEl == currentSelectedEl) {
					return;
				}
				if (pageEl.getAttribute('page-number') == '...') {
					// change pagination buttons
					return
				}
				if (pageEl.getAttribute('page-number') == 0) {
					prevAEl.classList.add('r-disabled')
				} else {
					prevAEl.classList.remove('r-disabled')
				}
				if (pageEl.getAttribute('page-number') == paginationButtons[paginationButtons.length-2].getAttribute('page-number')) {
					nextAEl.classList.add('r-disabled')
				} else {
					nextAEl.classList.remove('r-disabled')
				}
				if (pageEl == prevAEl) {
					let previousA = currentSelectedEl.parentElement.previousElementSibling.children[0]
					previousA.click()
					return
				} else if (pageEl == nextAEl) {
					let nextA = currentSelectedEl.parentElement.nextElementSibling.children[0]
					nextA.click()
					return
				}
				paginationButtons.forEach(function (el) {
					el.classList.remove('r-selected');
				})
				pageEl.classList.add('r-selected');
				self.processedData.currentPageNumber = pageEl.getAttribute('page-number');
				self.processedData.currentPageData = self.processedData.groupData[self.processedData.currentPageNumber];
				self.renderer.renderTableData();
				self.renderer.renderTableFooter();
			})
		})
	}

	registerEvents() {
		this.registerPagination();
	}
}