interface Warning {
	message: string
	breaking: boolean
}

export class Warnings extends Array<Warning> {
	add(active: boolean, message: string, breaking = false) {
		if (active) {
			this.push({ message, breaking })
		}
		return this
	}
}
