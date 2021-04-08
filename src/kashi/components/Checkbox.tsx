import React from 'react'

export type Color = 'pink' | 'blue'

const COLOR = {
	pink: 'checked:bg-pink checked:border-transparent focus:ring-pink',
	blue: 'checked:bg-blue checked:border-transparent focus:ring-blue'
}

export interface CheckboxProps {
	color: Color
}

function Checkbox({
	color,
	className,
	...rest
}: CheckboxProps & React.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
	return <input type="checkbox" className={`appearance-none ${COLOR[color]} ${className}`} {...rest} />
}

export default Checkbox
