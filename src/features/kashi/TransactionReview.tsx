import React from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'react-feather'

import { Direction, TransactionReview } from '../../entities/TransactionReview'

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
                  {line.direction === Direction.FLAT ? (
                    <ArrowRight
                      size="1rem"
                      style={{
                        display: 'inline',
                        marginRight: '6px',
                        marginLeft: '6px',
                      }}
                    />
                  ) : line.direction === Direction.UP ? (
                    <ArrowUpRight
                      size="1rem"
                      style={{
                        display: 'inline',
                        marginRight: '6px',
                        marginLeft: '6px',
                      }}
                    />
                  ) : (
                    <ArrowDownRight
                      size="1rem"
                      style={{
                        display: 'inline',
                        marginRight: '6px',
                        marginLeft: '6px',
                      }}
                    />
                  )}
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
