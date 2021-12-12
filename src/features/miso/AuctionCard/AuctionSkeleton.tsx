const AuctionSkeleton = () => {
  return (
    <div className="h-[500px] animate-pulse rounded bg-dark-900 border border-dark-800 pt-5 overflow-hidden transition-all shadow-md hover:translate-y-[-3px] hover:shadow-xl hover:shadow-pink/5">
      <div className="h-full flex flex-col gap-3.5">
        <div className="grid grid-cols-3 gap-4 px-5">
          <div className="h-2 bg-dark-800 rounded" />
          <div className="h-2 bg-dark-800 rounded" />
        </div>
        <div />
        <div className="flex flex-col px-5 gap-2">
          <div className="w-20 h-2 bg-dark-800 rounded" />
          <div className="w-[120px] h-8 bg-dark-700 rounded" />
        </div>
        <div className="flex justify-between bg-dark-800 px-5 py-3 items-center ">
          <div className="grid grid-cols-4 gap-3 items-center">
            <div className="rounded-full bg-dark-700 h-[18px] w-[18px]" />
            <div className="col-span-3 h-4 bg-dark-700 rounded" />
          </div>
          <div className="h-4 bg-dark-700 rounded" />
        </div>
        <div className="flex justify-between px-5">
          <div className="flex flex-col">
            <div className="h-4 bg-dark-700 rounded" />
            <div className="h-4 bg-dark-700 rounded" />
          </div>
          <div className="flex flex-col">
            <div className="h-4 bg-dark-700 rounded" />
            <div className="h-4 bg-dark-700 rounded" />
          </div>
        </div>
        <div className="flex-[11] h-full" />
        <div className="grid grid-cols-2 gap-3 px-5 py-4 bg-dark-800 flex-grow">
          <div className="flex flex-col gap-2">
            <div className="h-8 bg-dark-700 rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-8 bg-dark-700 rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-8 bg-dark-700 rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-8 bg-dark-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionSkeleton
