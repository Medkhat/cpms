import { AiOutlineArrowUp } from "react-icons/ai";
import { HiBadgeCheck } from "react-icons/hi";
import { TiCancel } from "react-icons/ti";
import { useAppSelector } from "../../../app/hooks";
import { PartnerTypes } from "../../../app/reducers/partners";
import { FetchingTypes } from "../../../app/types";
import { StyledPartnerCard, StyledPartnerCards } from "./style";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { appColors } from "../../../app/helpers";

export const PartnerCards: React.FC<{
  setSinglePartner: (partner: PartnerTypes) => void;
  setPartnerFormState: (state: boolean) => void;
}> = ({ setSinglePartner, setPartnerFormState }) => {
  const data: Array<PartnerTypes> = useAppSelector(
    (state) => state.partners.data
  );
  const fetching: FetchingTypes = useAppSelector(
    (state) => state.partners.fetching
  );
  const handleClick = (id: string) => {
    setSinglePartner({ ...data.filter((item) => item.id === id)[0] });
    setPartnerFormState(true);
  };
  return (
    <StyledPartnerCards>
      {fetching === "pending"
        ? [1, 2, 3, 4, 5, 6, 7].map((item) => (
            <SkeletonTheme
              key={item}
              color={appColors.gray}
              highlightColor={appColors.lightGray}
            >
              <Skeleton width={"100%"} height={150} />
            </SkeletonTheme>
          ))
        : data.map((item) => (
            <StyledPartnerCard
              key={item.id}
              onClick={() => handleClick(item.id)}
            >
              <img
                src={item.image_url.substring(0, item.image_url.length - 4)}
                alt={"PARTNER LOGO"}
              />
              <div className={"partner-info"}>
                <h3>{item.name}</h3>
                <p>
                  <span className={`state ${item.state}`}>
                    {item.state_title}
                  </span>
                  <span className={"priority"}>
                    {item.display_priority} <AiOutlineArrowUp />{" "}
                  </span>
                </p>
                <p className={"broker-member"}>
                  <span className={"broker-member__text"}>
                    Участие в брокере:
                  </span>{" "}
                  <span
                    className={`broker-member__icon ${
                      item.is_broker_member ? "yes" : "no"
                    }`}
                  >
                    {item.is_broker_member ? <HiBadgeCheck /> : <TiCancel />}
                  </span>
                </p>
              </div>
            </StyledPartnerCard>
          ))}
    </StyledPartnerCards>
  );
};
