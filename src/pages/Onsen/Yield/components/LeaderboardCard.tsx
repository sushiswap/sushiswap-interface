import React from "react";
import Button from "./Button";
import OnsenCardBg from 'assets/images/onsen-card-bg.gif'
import styled from "styled-components";

const CardWrapper = styled.div`
    background-image: url(${OnsenCardBg});
    background-repeat: no-repeat;
    width: 335px;
    height: 180px;
`

export default function LeaderboardCard({className}: any) {
    return (
        <CardWrapper className={className + " rounded px-2"}>
            <div className="flex flex-col justify-center items-center text-center">
                <div
                    className="font-bold text-h4 text-high-emphesis mb-6"
                >
                    Hot competition bubbling up in the ONSEN.
                </div>
                <Button
                    color="gradient"
                    size="small"
                    className="w-max font-bold text-caption2 self-center"
                >
                    View the Leaderboards
                </Button>
            </div>
        </CardWrapper>
    )
}