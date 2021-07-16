import Link from 'next/link'
import { classNames } from '../../functions'
import { useRouter } from 'next/router'

export default function PairTabs({ tabs }: { tabs: any[] }): JSX.Element {
  const router = useRouter()

  return (
    <>
      <div className="border-b border-gray-700">
        <nav className="flex -mb-px space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <div key={tab.name}>
              <Link href={tab.href}>
                <a
                  className={classNames(
                    router.asPath === tab.href
                      ? tab.customCurrent ?? 'bg-gradient-to-r from-blue to-pink text-transparent bg-clip-text'
                      : 'text-primary hover:text-gray-200',
                    'group flex flex-auto flex-col px-1 font-bold text-lg'
                  )}
                >
                  <div className="inline-flex items-center py-2">
                    {tab.icon && (
                      <div className={'mr-2'} style={router.asPath !== tab.href ? { visibility: 'hidden' } : {}}>
                        {tab.icon}
                      </div>
                    )}
                    <span>{tab.name}</span>
                  </div>
                  <div className="">
                    <div
                      className={classNames(
                        router.asPath === tab.href &&
                          'border-gradient-r-blue-pink-dark-900 border bg-transparent border-transparent',
                        'w-full'
                      )}
                    />
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}
