import styled from "styled-components";

export const NavWrapper = styled.div`
  height: 100%;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
`;
export const LinksWrapper = styled.div`
  margin-bottom: 20px;
  a {
    display: block;
    text-decoration: none;
    color: rgb(115, 113, 113);
    padding: 15px 0;
    border-bottom: 1px solid rgb(115, 113, 113);
  }
  a:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  a:first-child {
    padding-top: 0;
  }
  a:hover,
  a.active {
    color: #fff;
  }
`;
