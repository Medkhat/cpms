import ReactSwitch from "react-switch";
import { appColors } from "../../../app/helpers";
import { Button } from "../../common/button";
import { FormGroup, StyledErrorMessage } from "../../common/style";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { PartnerTypes, postPartners } from "../../../app/reducers/partners";
import { FetchingTypes } from "../../../app/types";
import { useEffect, useState } from "react";
import { ImCancelCircle } from "react-icons/im";
import { AiOutlineEdit } from "react-icons/ai";
import { InputWithLabel } from "../../common/input";

type PartnerFormProps = {
  onClose: () => void;
  singlePartner: PartnerTypes | null;
};

// Yup validation schema for partner form
const validationSchema = Yup.object().shape({
  code: Yup.string().required("Обязательное поле"),
  name: Yup.string().required("Обязательное поле"),
  guid: Yup.string().required("Обязательное поле"),
  image_url: Yup.string().required("Обязательное поле"),
  display_priority: Yup.number()
    .typeError("Только цифры")
    .required("Обязательное поле"),
});

export const PartnerForm: React.FC<PartnerFormProps> = ({
  onClose,
  singlePartner,
}) => {
  const dispatch = useAppDispatch();
  const addFetching: FetchingTypes = useAppSelector(
    (state) => state.partners.addFetching
  );
  const [editMode, setEditMode] = useState<boolean>(
    singlePartner ? false : true
  );
  const formik = useFormik({
    initialValues: singlePartner
      ? {
          ...singlePartner,
          display_priority: singlePartner.display_priority.toString(),
        }
      : {
          code: "",
          state: "active",
          name: "",
          guid: "",
          image_url: "",
          is_broker_member: false,
          display_priority: "",
        },
    validationSchema,
    onSubmit: (values) =>
      dispatch(
        postPartners(
          singlePartner
            ? {
                method: "put",
                id: singlePartner.id,
                ...values,
                display_priority: parseInt(values.display_priority),
                products: [],
              }
            : {
                method: "post",
                ...values,
                display_priority: parseInt(values.display_priority),
                products: [],
              }
        )
      ),
  });

  useEffect(() => {
    if (addFetching === "success" || addFetching === "failed") onClose();
  }, [addFetching, onClose]);

  return (
    <>
      {singlePartner && (
        <FormGroup>
          <Button
            type={"button"}
            colors={
              editMode
                ? {
                    bgColor: appColors.lightGray,
                    textColor: appColors.black,
                  }
                : {
                    bgColor: appColors.primary,
                    textColor: appColors.white,
                  }
            }
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? <ImCancelCircle /> : <AiOutlineEdit />}
            <span className={"btn-text"}>
              {editMode ? "Отменить редактирование" : "Редактировать"}
            </span>
          </Button>
        </FormGroup>
      )}
      <form onSubmit={formik.handleSubmit}>
        <FormGroup>
          <InputWithLabel
            id={"name"}
            name={"name"}
            type={"text"}
            label={"Название партнера"}
            value={formik.values.name}
            onChange={(e) => formik.setFieldValue("name", e.target.value)}
            disabled={!editMode}
          />
          {formik.touched.name && formik.errors.name && (
            <StyledErrorMessage>{formik.errors.name}</StyledErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <InputWithLabel
            id={"code"}
            name={"code"}
            type={"text"}
            label={"Код партнера"}
            value={formik.values.code}
            onChange={(e) => formik.setFieldValue("code", e.target.value)}
            disabled={!editMode}
          />
          {formik.touched.code && formik.errors.code && (
            <StyledErrorMessage>{formik.errors.code}</StyledErrorMessage>
          )}
        </FormGroup>
        <FormGroup>
          <InputWithLabel
            id={"guid"}
            name={"guid"}
            type={"text"}
            label={"GUID"}
            value={formik.values.guid}
            onChange={(e) => formik.setFieldValue("guid", e.target.value)}
            disabled={!editMode}
          />
          {formik.touched.guid && formik.errors.guid && (
            <StyledErrorMessage>{formik.errors.guid}</StyledErrorMessage>
          )}
        </FormGroup>
        <FormGroup>
          <InputWithLabel
            id={"display_priority"}
            name={"display_priority"}
            type={"number"}
            label={"Приоритет"}
            value={formik.values.display_priority.toString()}
            onChange={(e) =>
              formik.setFieldValue("display_priority", e.target.value)
            }
            disabled={!editMode}
          />
          {formik.touched.display_priority &&
            formik.errors.display_priority && (
              <StyledErrorMessage>
                {formik.errors.display_priority}
              </StyledErrorMessage>
            )}
        </FormGroup>
        <FormGroup>
          <InputWithLabel
            id={"image_url"}
            name={"image_url"}
            type={"text"}
            label={"Ссылка на картинку"}
            value={formik.values.image_url}
            onChange={(e) => formik.setFieldValue("image_url", e.target.value)}
            disabled={!editMode}
          />
          {formik.touched.image_url && formik.errors.image_url && (
            <StyledErrorMessage>{formik.errors.image_url}</StyledErrorMessage>
          )}
        </FormGroup>
        <FormGroup dsp={"flex"}>
          <span>Статус активности</span>
          <ReactSwitch
            checked={formik.values.state === "active"}
            onChange={() =>
              formik.setFieldValue(
                "state",
                formik.values.state === "active" ? "inactive" : "active"
              )
            }
            checkedIcon={false}
            uncheckedIcon={false}
            disabled={!editMode}
          />
        </FormGroup>
        <FormGroup dsp={"flex"}>
          <span>Участие в брокере</span>
          <ReactSwitch
            onChange={() =>
              formik.setFieldValue(
                "is_broker_member",
                !formik.values.is_broker_member
              )
            }
            checked={formik.values.is_broker_member}
            checkedIcon={false}
            uncheckedIcon={false}
            disabled={!editMode}
          />
        </FormGroup>
        <FormGroup dsp={"flex"} className={"form-btns"}>
          <Button
            colors={{
              bgColor: appColors.lightGray,
              textColor: appColors.black,
            }}
            onClick={onClose}
          >
            <span className={"btn-text"}>Отмена</span>
          </Button>
          <Button
            colors={{
              bgColor: appColors.primary,
              textColor: appColors.white,
            }}
            type={"submit"}
            disabled={!editMode}
          >
            <span className={"btn-text"}>
              {addFetching === "pending"
                ? "Подождите..."
                : singlePartner
                ? "Сохранить"
                : "Добавить"}
            </span>
          </Button>
        </FormGroup>
      </form>
    </>
  );
};
