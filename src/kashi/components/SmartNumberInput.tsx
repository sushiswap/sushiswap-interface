import React from 'react'
import { ArrowDownRight, ArrowUpRight } from 'react-feather'
import { formattedNum } from 'utils'
import { Button } from 'components'
import { Input as NumericalInput } from 'components/NumericalInput'
import { BigNumber } from '@ethersproject/bignumber'

type SmartNumberInputProps = {
    color: 'blue' | 'pink'
    token: any
    value: string
    setValue: any

    useBentoTitleDirection: 'up' | 'down'
    useBentoTitle: string
    useBento: boolean
    setUseBento: any

    maxTitle?: string
    max: BigNumber
    pinMax?: boolean
    setPinMax?: any
    showMax?: boolean
}

export default function SmartNumberInput({
    color = 'blue',
    token,
    value,
    setValue,

    useBentoTitleDirection = 'down',
    useBentoTitle = '',
    useBento,
    setUseBento,

    maxTitle = 'Max',
    max,
    pinMax = false,
    setPinMax,
    showMax = false
}: SmartNumberInputProps) {
    return (
        <>
            <div className="flex items-center justify-between my-4">
                <div className="flex items-center text-base text-secondary">
                    <span>
                        {useBentoTitleDirection == 'down' ? (
                            <ArrowDownRight size="1rem" style={{ display: 'inline' }} />
                        ) : (
                            <ArrowUpRight size="1rem" style={{ display: 'inline' }} />
                        )}
                    </span>
                    <span className="mx-2">{useBentoTitle}</span>
                    <span>
                        <Button
                            variant="outlined"
                            size="small"
                            color={color}
                            className={'focus:ring focus:ring-' + color}
                            onClick={() => {
                                setUseBento(!useBento)
                            }}
                        >
                            {useBento ? 'BentoBox' : 'Wallet'}
                        </Button>
                    </span>
                </div>
                <div className="text-base text-secondary text-right" style={{ display: 'inline', cursor: 'pointer' }}>
                    {maxTitle} {formattedNum(max.toFixed(token.decimals))}
                </div>
            </div>

            <div className="flex items-center relative w-full mb-4">
                <NumericalInput
                    className={'w-full p-3 bg-input rounded focus:ring focus:ring-' + color}
                    value={value}
                    onUserInput={setValue}
                    onFocus={() => {
                        if (pinMax) {
                            setValue('')
                        }
                        if (setPinMax) {
                            setPinMax(false)
                        }
                    }}
                />
                {showMax && max.gt(0) && (
                    <Button
                        variant="outlined"
                        size="small"
                        color={color}
                        onClick={() => {
                            if (setPinMax) {
                                setPinMax(true)
                            } else {
                                setValue(max.toFixed(token.decimals))
                            }
                        }}
                        className={'absolute right-4 focus:ring focus:ring-' + color}
                    >
                        MAX
                    </Button>
                )}
            </div>
        </>
    )
}
