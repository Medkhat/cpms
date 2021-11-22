import { useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { GiCancel } from "react-icons/gi";
import { appColors } from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  PartnerTypes,
  setAddFetching,
  setIsTokenExp,
  setPartnersFailedAlertState,
  setPartnersSuccessAlertState,
} from "../../../app/reducers/partners";
import { Alert } from "../../common/alert";
import { ExpiredTokenMessage } from "../../common/expiredTokenMessage";
import { Modal } from "../../common/modal";
import { ContentActions } from "../../content/actions";
import { PartnerCards } from "../../content/cards";
import { PartnerForm } from "./form";

export const Partners: React.FC = () => {
  const dispatch = useAppDispatch();

  const isTokenExp: boolean = useAppSelector(
    (state) => state.partners.isTokenExp
  );
  const successAlertState: boolean = useAppSelector(
    (state) => state.partners.successAlertState
  );
  const failedAlertState: boolean = useAppSelector(
    (state) => state.partners.failedAlertState
  );
  const alertMessage: string = useAppSelector(
    (state) => state.partners.message
  );

  const [partnerFormState, setPartnerFormState] = useState<boolean>(false);
  const [singlePartner, setSinglePartner] = useState<PartnerTypes | null>(null);

  // useEffect(() => {
  //   dispatch(getPartners());
  // }, [dispatch]);

  const handleClosePartnerForm = () => {
    setPartnerFormState(false);
    setSinglePartner(null);
    dispatch(setAddFetching("idle"));
  };
  return (
    <>
      <ContentActions
        contentType={"partners"}
        addText={"Добавить партнера"}
        handleClickAdd={() => setPartnerFormState(true)}
      />
      <PartnerCards
        setSinglePartner={setSinglePartner}
        setPartnerFormState={setPartnerFormState}
      />
      <Modal open={isTokenExp} title={"Сообщение"}>
        <ExpiredTokenMessage setIsTokenExp={setIsTokenExp} />
      </Modal>
      <Modal
        open={partnerFormState}
        title={singlePartner ? "Изменение партнера" : "Добавление партнера"}
        onClose={handleClosePartnerForm}
      >
        <PartnerForm
          onClose={handleClosePartnerForm}
          singlePartner={singlePartner}
        />
      </Modal>
      {successAlertState && (
        <Alert
          Icon={() => <BsCheckCircle />}
          text={alertMessage}
          open={successAlertState}
          onClose={() => dispatch(setPartnersSuccessAlertState(false))}
          colors={{ bgColor: appColors.green, textColor: appColors.white }}
        />
      )}
      {failedAlertState && (
        <Alert
          Icon={() => <GiCancel />}
          text={alertMessage}
          open={failedAlertState}
          onClose={() => dispatch(setPartnersFailedAlertState(false))}
          colors={{ bgColor: appColors.primary, textColor: appColors.white }}
        />
      )}
    </>
  );
};
