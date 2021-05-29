import React, { FC, useState } from 'react'
import ToggleButtonGroup from '../Toggle/ToggleButtonGroup'
import ToggleButton from '../Toggle/ToggleButton'

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
    header?: JSX.Element
    footer?: JSX.Element
}

const TabCard: FC<TabCardProps> = ({ titles, components, footer }) => {
    const [value, setValue] = useState(0)
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
    }

    return (
        <>
            <div className="rounded-t px-2 py-2 pt-2 sm:px-4 sm:py-3 sm:pt-4 flex justify-between items-center h-[60px] sm:h-[72px]">
                <div className="flex w-full justify-between">
                    <ToggleButtonGroup active={value}>
                        {titles.map((el) => (
                            <ToggleButton key={el} onClick={handleChange}>
                                {el}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
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
