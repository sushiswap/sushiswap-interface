import { classNames } from '../../functions'

interface PairTabsProps {
  tabs: any[]
  currentType: string
  setType: Function
}

export default function PairTabs({ tabs, currentType, setType }: PairTabsProps): JSX.Element {
  return (
    <>
      <div className="border-b border-gray-700">
        <nav className="flex -mb-px space-x-4 overflow-x-auto whitespace-nowrap" aria-label="Tabs">
          {tabs.map((tab) => (
            <div key={tab.name}>
              <div
                className={classNames(
                  tab.type === currentType
                    ? tab.customCurrent ?? 'bg-gradient-to-r from-blue to-pink text-transparent bg-clip-text'
                    : 'text-primary hover:text-gray-200',
                  'group flex flex-auto flex-col px-1 font-bold text-lg cursor-pointer'
                )}
                onClick={() => setType(tab.type)}
              >
                <div className="inline-flex items-center py-2">
                  {tab.icon && (
                    <div className={'mr-2'} style={tab.type !== currentType ? { visibility: 'hidden' } : {}}>
                      {tab.icon}
                    </div>
                  )}
                  <span>{tab.name}</span>
                </div>
                <div className="">
                  <div
                    className={classNames(
                      tab.type === currentType &&
                        'border-gradient-r-blue-pink-dark-900 border bg-transparent border-transparent',
                      'w-full'
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
