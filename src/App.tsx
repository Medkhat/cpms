import { Redirect, Route, Switch } from "react-router";
import { Header } from "./components/header";
import { Navbar } from "./components/navbar";
import { Products } from "./components/pages/product";
import { Partners } from "./components/pages/partners";
import { ChangesAudit } from "./components/pages/audit";
import { SignIn } from "./components/pages/auth";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { RootState } from "./app/store";
import { getPartners } from "./app/reducers/partners";

function App() {
  const isAuth: boolean = useAppSelector(
    (state: RootState) => state.auth.isAuth
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    const rootElement = document.getElementById("cpms-root");
    if (rootElement && isAuth) {
      dispatch(getPartners());
      rootElement.className = "cpms-app";
    }
    if (rootElement && !isAuth) rootElement.className = "cpms-auth";
  }, [isAuth, dispatch]);

  if (!isAuth)
    return (
      <>
        <Redirect to={"/auth"} />
        <Route exact path={"/auth"} component={SignIn} />
      </>
    );

  return (
    <>
      <Header />
      <Navbar />
      <div className={"app-grid__item content"}>
        <Switch>
          <Route exact path={"/partners"} component={Partners} />
          <Route exact path={"/products"} component={Products} />
          <Route exact path={"/audit"} component={ChangesAudit} />
          <Redirect to={"/partners"} />
        </Switch>
      </div>
    </>
  );
}

export default App;
