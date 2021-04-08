import React from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { getTokenIcon } from 'kashi/functions'

export default function ListBox({ label, tokens, selectedToken, setSelectedToken }: any) {
	return (
		<div className="flex items-center justify-center">
			<div className="w-full">
				<Listbox as="div" className="space-y-1" value={selectedToken} onChange={setSelectedToken}>
					{({ open }) => (
						<>
							<Listbox.Label className="block text-base leading-5 font-medium text-gray-700 pb-2">
								{label}
							</Listbox.Label>
							<div className="relative">
								<span className="inline-block w-full rounded-md shadow-sm">
									<Listbox.Button className="cursor-default relative w-full rounded-md border bg-input border-none p-3 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
										<span className="truncate flex items-center">
											<img src={getTokenIcon(selectedToken.address)} className="w-10 h-10 rounded-sm mr-4" />
											<span className="text-lg">{selectedToken.symbol}&nbsp;</span>
											<span className="text-lg text-secondary">{selectedToken.name}</span>
										</span>
										<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
											<svg className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="none" stroke="currentColor">
												<path
													d="M7 7l3-3 3 3m0 6l-3 3-3-3"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</span>
									</Listbox.Button>
								</span>

								<Transition
									show={open}
									leave="transition ease-in duration-100"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
									className="z-10 absolute mt-1 w-full rounded-md bg-input shadow-lg"
								>
									<Listbox.Options
										static
										className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:border-none focus:outline-none sm:text-sm sm:leading-5"
									>
										{tokens.map((token: any) => (
											<Listbox.Option key={token.address} value={token}>
												{({ selected, active }) => (
													<div className={`${active ? 'bg-dark-blue' : ''} cursor-pointer relative p-3`}>
														<span className="flex truncate items-center">
															<img src={getTokenIcon(token.address)} className="w-10 h-10 rounded-sm mr-4" />
															<span className="text-lg">{token.symbol}&nbsp;</span>
															<span className="text-lg text-secondary">{token.name}</span>
														</span>
													</div>
												)}
											</Listbox.Option>
										))}
									</Listbox.Options>
								</Transition>
							</div>
						</>
					)}
				</Listbox>
			</div>
		</div>
	)
}
