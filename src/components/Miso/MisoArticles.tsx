import React from 'react'

function MisoArticles({ title = '', content = '' }: { title?: any; content: any }) {
  return (
    <div className="col-span-12 md:col-span-6 xl:col-span-4 xl:mx-8">
      <div className="flex">
        <div className="self-end mb-3 text-lg font-bold md:text-xl text-high-emphesis md:mb-7">{title}</div>
      </div>
      <div className="pr-3 mb-2 text-sm leading-5 text-white md:text-base md:mb-4 md:pr-0 opacity-50">{content}</div>
    </div>
  )
}

export default MisoArticles
