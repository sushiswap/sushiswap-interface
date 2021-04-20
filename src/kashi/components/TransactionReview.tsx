import { Direction, TransactionReview } from 'kashi/entities'
import React from 'react'

function TransactionReviewView({ transactionReview }: { transactionReview: TransactionReview }) {
    return (
        <>
            {transactionReview && transactionReview.length > 0 && (
                <div className="py-4 mb-4">
                    <div className="text-xl text-high-emphesis">Transaction Review</div>
                    {transactionReview.map((line, i) => {
                        return (
                            <div className="flex items-center justify-between" key={i}>
                                <div className="text-lg text-secondary">{line.name}:</div>
                                <div className="text-lg">
                                    {line.from}
                                    {line.direction === Direction.FLAT
                                        ? ' ➙ '
                                        : line.direction === Direction.UP
                                        ? ' ➚ '
                                        : ' ➘ '}
                                    {line.to}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    )
}

export default TransactionReviewView
