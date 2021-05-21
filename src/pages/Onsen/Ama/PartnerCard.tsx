import React from 'react'

interface PartnerCardProps {
    className?: string
    coverImgSrc: string
    profileImgSrc: string
    symbol: string
    name: string
    date: string
}

export default function PartnerCard({
    className = '',
    coverImgSrc,
    profileImgSrc,
    symbol,
    name,
    date
}: PartnerCardProps) {
    return (
        <div className={`h-60 w-60 ${className}`}>
            <img className="h-3/6 w-full rounded-t" src={coverImgSrc} alt="cover image" />
            <div className="relative w-full h-0">
                <img className="absolute right-0 -top-6 mr-7 h-12 w-12" src={profileImgSrc} alt="profile image" />
            </div>
            <div className="flex flex-col w-full h-3/6 rounded-b p-4 bg-dark-900">
                <p className="text-secondary font-bold text-caption2">{symbol}</p>
                <p className="text-high-emphesis font-bold text-body">{name}</p>
                <p className="text-secondary font-bold text-caption2 mt-auto">{date}</p>
            </div>
        </div>
    )
}
