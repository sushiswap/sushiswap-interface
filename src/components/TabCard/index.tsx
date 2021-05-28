import React, { FC, useState } from 'react'

interface TabProps {
    title: string
    active: boolean
    index: number
    onClick: (event: React.ChangeEvent<{}>, index: number) => void
}

export const Tab: FC<TabProps> = ({ title, index, active, onClick }) => {
    return (
        <span
            className={`rounded px-3 py-1.5 cursor-pointer hover:text-primary ${
                active ? 'text-primary' : 'text-secondary'
            } ${active ? 'bg-dark-900' : 'bg-dark-1000'}`}
            onClick={e => onClick(e, index)}
        >
            {title}
        </span>
    )
}

interface TabPanelProps {
    value: number
    index: number
    unmount?: boolean
}

export const TabPanel: FC<TabPanelProps> = ({ value, index, unmount = false, children }) => {
    if (unmount) {
        return value === index ? <div role="tabpanel h-full">{children}</div> : <div role="tabpanel h-full" />
    }

    return (
        <div role="tabpanel" className={`h-full ${value !== index ? 'hidden' : ''}`}>
            {children}
        </div>
    )
}

interface TabCardProps {
    titles: string[]
    components: JSX.Element[]
    className?: string
    header?: JSX.Element
    footer?: JSX.Element
}

const TabCard: FC<TabCardProps> = ({ className = '', titles, components, footer }) => {
    const [value, setValue] = useState(0)
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
    }

    return (
        <>
            <div className="rounded-t px-2 py-2 pt-2 sm:px-4 sm:py-3 sm:pt-4 flex justify-between items-center h-[60px] sm:h-[72px]">
                <div className="flex w-full justify-between">
                    <div className="flex items-center rounded-xl bg-dark-1000 p-1">
                        <div className="text-md font-black whitespace-nowrap grid grid-flow-col">
                            {titles.map((el, index) => (
                                <Tab
                                    title={el}
                                    key={el}
                                    index={index}
                                    active={value === index}
                                    onClick={handleChange}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-2 pt-4 pb-0 sm:p-4 sm:pb-0 h-[calc(100%-60px)] sm:h-[calc(100%-72px)] overflow-x-scroll">
                {components.map((component, index) => (
                    <TabPanel value={value} index={index} key={index}>
                        {component}
                    </TabPanel>
                ))}
            </div>
            {footer && <>{footer}</>}
        </>
    )
}

export default TabCard
