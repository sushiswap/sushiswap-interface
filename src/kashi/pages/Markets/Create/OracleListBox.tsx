import React, { useState } from 'react'

import { Listbox } from '@headlessui/react'

const oracles = [
    { id: 1, name: 'Chainlink', unavailable: false },
    { id: 2, name: 'SushiSwap TWAP', unavailable: false },
    { id: 3, name: 'Pegged', unavailable: true }
]

function OracleListBox(): JSX.Element {
    const [selectedOracle, setSelectedOracle] = useState(oracles[0])
    return (
        <div className="flex items-center justify-center">
            <div className="w-full">
                <Listbox value={selectedOracle} onChange={setSelectedOracle}>
                    <Listbox.Button>{selectedOracle.name}</Listbox.Button>
                    <Listbox.Options>
                        {oracles.map(oracle => (
                            <Listbox.Option key={oracle.id} value={oracle} disabled={oracle.unavailable}>
                                {oracle.name}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Listbox>
            </div>
        </div>
    )
}

export default OracleListBox
