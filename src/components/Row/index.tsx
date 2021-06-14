import React, { FC } from "react";

import { classNames } from "../../functions";
import styled from "styled-components";

// const Row = styled(Box)<{
//     width?: string
//     align?: string
//     justify?: string
//     padding?: string
//     border?: string
//     borderRadius?: string
// }>`
//     width: ${({ width }) => width ?? '100%'};
//     display: flex;
//     padding: 0;
//     align-items: ${({ align }) => align ?? 'center'};
//     justify-content: ${({ justify }) => justify ?? 'flex-start'};
//     padding: ${({ padding }) => padding};
//     border: ${({ border }) => border};
//     border-radius: ${({ borderRadius }) => borderRadius};
// `

interface RowProps {
  width?: string;
  align?: string;
  justify?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
}

export const Row: FC<React.HTMLAttributes<HTMLDivElement> & RowProps> = ({
  children,
  className,
  width,
  align,
  justify,
  padding,
  border,
  borderRadius,
  ...rest
}) => (
  <div
    className={classNames("w-full flex p-0", className)}
    style={{
      width,
      alignItems: align,
      justifyContent: justify,
      padding,
      border,
      borderRadius,
    }}
    {...rest}
  >
    {children}
  </div>
);

export const RowBetween = styled(Row)`
  justify-content: space-between;
`;

// export const RowBetween = styled(Row)`
//     justify-content: space-between;
// `

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const AutoRow = styled(Row)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;

export const RowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};
`;

export default Row;
