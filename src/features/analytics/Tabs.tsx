import { classNames } from '../../functions'

interface TabsProps {
  tabs: any[]
  currentType: string
  setType: Function
}

export default function Tabs({ tabs, currentType, setType }: TabsProps): JSX.Element {
  return (
    <>
      <div className="border-t border-b border-gray-700">
        <nav className="grid items-center grid-flow-col -mb-px overflow-x-auto whitespace-nowrap" aria-label="Tabs">
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={classNames(
                tab.type !== currentType && 'opacity-40 hover:opacity-80',
                'flex flex-col font-bold cursor-pointer text-high-emphesis'
              )}
              onClick={() => setType(tab.type)}
            >
              <div className="inline-flex items-center justify-center pt-4 pb-2">
                <div>
                  <div className="pb-2">{tab.name}</div>
                  <div
                    className={classNames(
                      tab.type === currentType && 'border-dark-700',
                      '-mb-2 border-4 border-transparent'
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}
