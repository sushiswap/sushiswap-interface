import React, { FC, useState } from 'react'
import ToggleButtonGroup from '../Toggle/ToggleButtonGroup'
import ToggleButton from '../Toggle/ToggleButton'

interface TabPanelProps {
    value: number
    index: number
    unmount?: boolean
}

export const TabPanel: FC<TabPanelProps> = ({
    value,
    index,
    unmount = false,
    children,
}) => {
    if (unmount) {
        return value === index ? (
            <div role="tabpanel h-full">{children}</div>
        ) : (
            <div role="tabpanel h-full" />
        )
    }

    return (
        <div
            role="tabpanel"
            className={`h-full ${value !== index ? 'hidden' : ''}`}
        >
            {children}
        </div>
    )
}

interface TabsProps {
    titles: string[]
    components: JSX.Element[]
    header?: JSX.Element
    footer?: JSX.Element
}

const Tabs: FC<TabsProps> = ({ titles, components, footer }) => {
    const [value, setValue] = useState(0)
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue)
    }

    return (
        <>
            <div className="flex justify-between items-center h-10 bg-dark-800">
                <div className="flex w-full justify-between h-full">
                    <ToggleButtonGroup active={value}>
                        {titles.map((el, index) => (
                            <ToggleButton
                                value={index}
                                key={el}
                                onClick={handleChange}
                            >
                                {el}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </div>
            </div>
            <div className="h-[calc(100%-40px)] overflow-x-scroll">
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

export default Tabs
