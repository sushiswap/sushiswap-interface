import { Trash } from "react-feather";
import styled from "styled-components";

export const TrashIcon = styled(Trash)`
  height: 16px;
  width: 18px;
  margin-left: 10px;
  stroke: currentColor;

  cursor: pointer;
  align-items: center;
  justify-content: center;
  display: flex;

  :hover {
    opacity: 0.7;
  }
`;

export default TrashIcon;
