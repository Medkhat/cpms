import styled from "styled-components";
import logo from "../../../assets/images/logo.svg";
import { FormGroup, StyledErrorMessage, StyledInput } from "../../common/style";
import { Button } from "../../common/button";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FetchingTypes } from "../../../app/types";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import { login, setAlertState } from "../../../app/reducers/auth";
import { Alert } from "../../common/alert";
import { ImInfo } from "react-icons/im";
import { appColors } from "../../../app/helpers";

const StyledAuthForm = styled.form`
  width: 320px;
  background-color: ${appColors.white};
  padding: 40px;
  border-radius: 10px;
  h3 {
    text-align: center;
    font-weight: 600;
  }
  .logo > * {
    display: block;
    text-align: center;
  }
  img {
    height: 40px;
  }
  .logo__text {
    margin-top: 5px;
  }
`;

// Yup validation schema for auth form
const validationSchema = Yup.object().shape({
  login: Yup.string().email("Некорректный логин").required("Обязательное поле"),
  password: Yup.string().required("Обязательное поле"),
});

export const SignIn: React.FC = () => {
  const dispatch = useAppDispatch();
  const fetching: FetchingTypes = useAppSelector(
    (state: RootState) => state.auth.fetching
  );
  const alertMessage: string = useAppSelector(
    (state: RootState) => state.auth.error
  );
  const alertState: boolean = useAppSelector(
    (state: RootState) => state.auth.alertState
  );

  // Formik object from useFormik
  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => dispatch(login(values)),
  });

  return (
    <>
      <StyledAuthForm onSubmit={formik.handleSubmit}>
        <div className={"logo"}>
          <img src={logo} alt={"LOGO"} />
          <span className={"logo__text"}>Управление брокером</span>
        </div>
        <h3>Авторизация</h3>
        <FormGroup>
          <StyledInput
            type={"text"}
            name={"login"}
            placeholder={"Логин, example@techodom.kz"}
            value={formik.values.login}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              formik.setFieldValue("login", e.target.value.trim())
            }
          />
          {formik.touched && formik.errors.login && (
            <StyledErrorMessage>{formik.errors.login}</StyledErrorMessage>
          )}
        </FormGroup>
        <FormGroup>
          <StyledInput
            type={"password"}
            name={"password"}
            placeholder={"Пароль"}
            onChange={formik.handleChange}
          />
          {formik.touched && formik.errors.password && (
            <StyledErrorMessage>{formik.errors.password}</StyledErrorMessage>
          )}
        </FormGroup>
        <FormGroup dsp={"flex"} className={"form-btns"}>
          <Button
            colors={{ bgColor: appColors.primary, textColor: appColors.white }}
            type={"submit"}
          >
            {fetching === "pending" ? "Подождите..." : "Войти"}
          </Button>
        </FormGroup>
      </StyledAuthForm>
      {alertState && (
        <Alert
          open={alertState}
          Icon={() => <ImInfo />}
          colors={{ bgColor: appColors.primary, textColor: appColors.white }}
          text={alertMessage}
          onClose={() => dispatch(setAlertState(false))}
        />
      )}
    </>
  );
};
