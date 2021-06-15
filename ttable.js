/**
 * @author Rifat Bin Reza <rifatbinreza@gmail.com>
 * version: 0.3
 * https://github.com/RifatBinReza/t-table/
 */


class TTable {
	constructor(id, options) {
		this.tableId = id
		this.originalTableEl = document.getElementById(id)
		this.tableEl = document.getElementById(id)
		this.sourceData = options.data
		this.dataProcessor = new DataProcessor(options)
		this.dataProcessor.processData()
		this.renderer = new Renderer(this.tableEl, this.originalTableEl)
		this.renderer.setData(this.dataProcessor.getProcessedData())
		this.events = new Events()
		this.events.setData(this.dataProcessor.getProcessedData())
		this.events.setRenderer(this.renderer)
	}

	getData() {
		return this.dataProcessor.getData()
	}

	getFullData() {
		return this.dataProcessor.getFullData()
	}

	init() {
		this.renderer.initContainer()
		this.initTable()
	}

	initTable() {
		this.renderer.renderTable()

		this.events.registerEvents()
	}
}