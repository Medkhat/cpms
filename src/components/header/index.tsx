import logo from "../../assets/images/logo.svg";
import { Button } from "../common/button";
import { AiOutlineLogout } from "react-icons/ai";
import { useAppDispatch } from "../../app/hooks";
import { setIsAuth } from "../../app/reducers/auth";
import { appColors } from "../../app/helpers";
import styled from "styled-components";
export const HeaderWrapper = styled.div`
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
  .logo,
  .user-info {
    display: flex;
    display: -webkit-flex;
    align-items: center;
  }
  .username {
    margin-right: 20px;
  }
  img {
    height: 30px;
  }
  .logo__line {
    margin: 0 10px;
    color: ${appColors.lightGray};
  }
  .logo__text {
    font-size: 16px;
    font-weight: 600;
  }
`;
export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    localStorage.clear();
    dispatch(setIsAuth(false));
  };
  return (
    <header className={"app-grid__item"}>
      <HeaderWrapper>
        <div className={"logo"}>
          <img src={logo} alt={"LOGO"} />
          <span className={"logo__line"}>|</span>
          <span className={"logo__text"}>Управление брокером</span>
        </div>

        <div className={"user-info"}>
          <span className={"username"}>{localStorage.getItem("username")}</span>
          <Button
            colors={{ bgColor: appColors.primary, textColor: appColors.white }}
            onClick={handleClick}
          >
            <span>Выйти</span>
            <AiOutlineLogout />
          </Button>
        </div>
      </HeaderWrapper>
    </header>
  );
};
