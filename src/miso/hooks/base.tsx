import Swal from 'sweetalert2'
import { EXPLORERS } from 'miso/constants/networks'

function typedKeys<T>(o: T): (keyof T)[] {
    // type cast should be safe because that's what really Object.keys() does
    return Object.keys(o) as (keyof T)[];
}

export const getTransactionLink = (txHash: string, chainId: number) => {
	let transactionLink
	if (isRightNetwork(chainId)) {
		typedKeys(EXPLORERS).forEach(id => {
			if (chainId == id) {
				const explorer = EXPLORERS[id].hasExplorer?EXPLORERS[id].explorer:null
				transactionLink = '' + explorer?.root + explorer?.tx + txHash
			}
		})
	}
	return transactionLink
}

export const getTokenLink = (tkAddress: string, chainId: number) => {
	let tokenLink
	if (isRightNetwork(chainId)) {
		typedKeys(EXPLORERS).forEach(id => {
			if (chainId == id) {
				const explorer = EXPLORERS[id].hasExplorer?EXPLORERS[id].explorer:null
				tokenLink = '' + explorer?.root + explorer?.address + tkAddress
			}
		})
	}
	return tokenLink
}

export const showTransactionSentModal = (txHash: string, chainId: number) => {
	if (isRightNetwork(chainId)) {
		typedKeys(EXPLORERS).forEach(id => {
			if (chainId == id) {
				const explorer = EXPLORERS[id].hasExplorer?EXPLORERS[id].explorer:null
				if (explorer)
					Swal.fire({
						icon: 'success',
						title: 'Your transaction has been sent...',
						html:
							'See on etherscan: ' +
							`<a href="${explorer.root}${explorer.tx}${txHash}" target="_blank">here</a>.`,
						buttonsStyling: false,
						showCancelButton: false,
						confirmButtonText: 'Close'
					})
			}
		})
	}
}

export const showErrorModal = (errorMessage: string) => {
	Swal.fire({
		icon: 'error',
		title: 'An unexpected error occurred',
		// html: "Please try again or reload the page.",
		html: `<p>Description: ${errorMessage}</p>
                       <b>Please make sure you have entered the correct data.</b></br>
                       <b>You may also reload the page and try again.</b>`,
		buttonsStyling: false,
		showCancelButton: false,
		confirmButtonText: 'Close',
	})
}

const showConnectionModal = (account: string, chainId: number) => {
	Swal.fire({
		icon: 'warning',
		title: getConnectionTitle(account, chainId),
		html: getConnectionBody(chainId),
		buttonsStyling: false,
		showCancelButton: false,
		confirmButtonText: 'CLOSE',
	})
}

const getConnectionTitle = (account: string, chainId: number) => {
	if (!!(isRightNetwork(chainId) && account)) {
		let name
		typedKeys(EXPLORERS).forEach(id => {
			if (chainId === id) {
				name = EXPLORERS[id].name
			}
		})
		return name
	} else if (!isRightNetwork(chainId) && chainId === 1) {
		return 'Testnet only, Mainnet upgrade'
	} else if (!isRightNetwork(chainId)) {
		return 'Wrong network'
	} else {
		return 'Account is not connected'
	}
}

const getConnectionBody = (chainId: number) => {
	let defaultNetworkName
	typedKeys(EXPLORERS).forEach(id => {
		if (EXPLORERS.defaultNetwork === id) {
			defaultNetworkName = EXPLORERS[id].name
		}
	})
	let name
	typedKeys(EXPLORERS).forEach(id => {
		if (chainId === id) {
			name = EXPLORERS[id].name
		}
	})
	try {
		if (!isRightNetwork) {
			return `You are on ${name} . Please change your network to ${defaultNetworkName}.`
		} else {
			return `Please connect wallet to continue.`
		}
	} catch (error) {
		return 'An unexpected error occurred. Please try loading the page'
	}
}

export const RIGHT_NETWORKS = [1, 5, 3, 4, 42, 97, 80001]
const isRightNetwork = (netId: any) => {
	return RIGHT_NETWORKS.includes(parseInt(netId))
}