import React from 'react'

export interface ToggleProps {
    id?: string
    isActive: boolean
    bgColor: string
    toggle: () => void
}

export default function ListToggle({ id, isActive, bgColor, toggle }: ToggleProps) {
    return (
        <div
            id={id}
            className={`${
                isActive ? 'bg-dark-700 text-high-emphesis' : 'bg-dark-800 text-primary'
            } rounded-full flex items-center outline-none cursor-pointer border-none py-1 px-3 space-x-3`}
            onClick={toggle}
        >
            {isActive && <div className="my-1.5 font-semibold">ON</div>}
            <div
                className={`rounded-full w-5 h-5 ${!isActive && 'bg-dark-700'}`}
                style={{ backgroundColor: isActive && bgColor }}
            />
            {!isActive && <div className="my-1.5 font-semibold">OFF</div>}
        </div>
    )
}
