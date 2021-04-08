import React from 'react'

export function Debugger({ data }: { data: object }) {
	if (process.env.NODE_ENV !== 'development') return null
	return (
		<div
			style={{
				background: '#19212e',
				borderRadius: '12px',
				marginTop: '10px',
				padding: '16px',
				width: '100%',
				overflowX: 'scroll',
				fontSize: '10px'
			}}
		>
			<pre>
				<code>{JSON.stringify(data, null, 2)}</code>
			</pre>
		</div>
	)
}
