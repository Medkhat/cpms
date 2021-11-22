import styled from "styled-components";
import { appColors } from "../../../app/helpers";

export const StyledPartnerCards = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
  max-height: calc(100vh - 175px);
  overflow-y: auto;
  padding-right: 20px;
  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(24, 24, 24, 0.3);
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${appColors.primary};
  }
`;
export const StyledPartnerCard = styled.div`
  background-color: ${appColors.white};
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px;
  border-radius: 5px;
  transition: box-shadow 0.2s;
  :hover h3 {
    color: ${appColors.primary};
  }
  :hover {
    cursor: pointer;
    box-shadow: 0 7px 10px 0 rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.2s;
  }
  h3 {
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
  }
  img {
    width: 130px;
  }
  p {
    margin: 0 0 10px 0;
  }
  .priority {
    padding: 1px 4px;
    background-color: ${appColors.skyBlue};
    color: ${appColors.white};
    margin-left: 10px;
    border-radius: 2px;
    display: inline-flex;
    align-items: center;
  }
  .state {
    padding: 1px 4px;
    border-radius: 2px;
    color: ${appColors.white};
  }
  .state.active {
    background-color: ${appColors.green};
  }
  .state.inactive {
    background-color: ${appColors.error};
  }
  .broker-member {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
  .broker-member__text {
    font-weight: 500;
  }
  .broker-member__icon {
    display: inline-flex;
    align-items: center;
    font-size: 19px;
  }
  .broker-member__icon.yes {
    color: ${appColors.green};
  }
  .broker-member__icon.no {
    color: ${appColors.error};
  }
`;
