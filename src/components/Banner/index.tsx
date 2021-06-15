import { FC } from "react";
import { XIcon } from "@heroicons/react/outline";

const Banner: FC = () => (
  <div className="relative w-full bg-purple bg-opacity-20">
    <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="pr-16 sm:text-center sm:px-16">
        <p className="font-medium text-white">
          <span className="md:hidden">We announced a new product!</span>
          <span className="hidden md:inline">
            Big news! We&apos;re excited to announce a brand new product.
          </span>
          <span className="block sm:ml-2 sm:inline-block">
            <a href="#" className="font-bold text-white underline">
              {" "}
              Learn more <span aria-hidden="true">&rarr;</span>
            </a>
          </span>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
        <button type="button" className="flex p-2 focus:outline-none">
          <span className="sr-only">Dismiss</span>
          <XIcon className="w-6 h-6 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
);

export default Banner;
