import { AiOutlinePlus } from "react-icons/ai";
import { BiFilterAlt } from "react-icons/bi";
import { GrPowerReset } from "react-icons/gr";
import { Button } from "../../common/button";
import { FiltersActions, StyledContentActions } from "./style";
import { ReactSelectValues } from "../../../app/types";
import { appColors } from "../../../app/helpers";

type ContentActionsPropTypes = {
  sortValues?: Array<ReactSelectValues>;
  addText?: string;
  contentType: "products" | "partners" | "audit";
  handleClickAdd?: () => void;
  handleClickFilter?: () => void;
  handleClickResetFilter?: () => void;
};

export const ContentActions: React.FC<ContentActionsPropTypes> = ({
  addText,
  contentType,
  handleClickAdd,
  handleClickFilter,
  handleClickResetFilter,
}) => {
  return (
    <StyledContentActions>
      {contentType !== "audit" && (
        <Button
          colors={{ bgColor: appColors.green, textColor: appColors.white }}
          onClick={handleClickAdd}
        >
          <AiOutlinePlus />
          <span className={"btn-text"}>{addText}</span>
        </Button>
      )}
      <FiltersActions>
        {contentType === "products" && (
          <>
            <Button
              colors={{
                bgColor: appColors.lightGray,
                textColor: appColors.black,
              }}
              onClick={handleClickResetFilter}
            >
              <GrPowerReset />
              <span className={"btn-text"}>Сбросить фильтр</span>
            </Button>
            <Button
              colors={{
                bgColor: appColors.primary,
                textColor: appColors.white,
              }}
              onClick={handleClickFilter}
            >
              <span className={"btn-text"}>Фильтр</span>
              <BiFilterAlt />
            </Button>
          </>
        )}
      </FiltersActions>
    </StyledContentActions>
  );
};
