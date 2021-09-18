import { useState } from 'react';
import Button from '../../components/Button';
import Container from '../../components/Container';

type ProtocolValues = {
  debt: number;
  liquidity: number;
  interestRate: number;
};

type PIDValues = {
  utilizationOptimal: number;
  kp: number;
  ki: number;
  kd: number;
};

type PreviousValues = {
  previousI: number;
  previousError: number;
};

const InterestModel = () => {
  const DECIMAL_POINTS = 1e18;

  const [protocolValues, setProtocolValues] = useState<ProtocolValues>({
    debt: 0,
    liquidity: 0,
    interestRate: 0,
  });

  const [pidValues, setPidValues] = useState<PIDValues>({
    utilizationOptimal: 0,
    kp: 0,
    ki: 0,
    kd: 0,
  });

  const [previousValues, setPreviousValues] = useState<PreviousValues>({
    previousI: 0,
    previousError: 0,
  });

  const [interestRate, setInterestRate] = useState<number>(0);

  const canonicalPid = (
    pidParams: PIDValues,
    prevValues: PreviousValues,
    debt: number,
    liquity: number,
    previousInterestRate: number
  ) => {
    const u = (debt * DECIMAL_POINTS) / liquity;
    const error = pidParams.utilizationOptimal - u;
    const p = (pidParams.kp * error) / DECIMAL_POINTS;
    const i = prevValues.previousI + (pidParams.ki * error) / DECIMAL_POINTS;
    const d = ((error - prevValues.previousError) * pidParams.kd) / DECIMAL_POINTS;

    const newInterestRate = previousInterestRate + p + i + d;

    interestRate < 0 ? setInterestRate(0) : setInterestRate(newInterestRate);

    //*** set in object, set in other object,

    // set liquidity input, set debt input

    // prevValues.previousI = i;
    // prevValues.previousError = error;

    // return (uint256(newInterestRate), prevValues);
  };

  return (
    <Container id="supply-page" className="py-12 md:py-14 lg:py-16">
      <div className="flex justify-evenly">
        <p className="mt-3 font-semibold">Interest Model</p>
        <div>
          <Button
            color="gradient"
            onClick={() => {
              console.log('interestmodel.click()');

              canonicalPid(
                pidValues,
                previousValues,
                protocolValues.debt,
                protocolValues.liquidity,
                protocolValues.interestRate
              );

              console.log('PID Values:', pidValues);

              console.log('Previous Values:', previousValues);

              console.log('Protocol values:', protocolValues);
            }}
          >
            update
          </Button>
        </div>
      </div>
      <div className="mt-16">Results</div>
    </Container>
  );
};
export default InterestModel;
