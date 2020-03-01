if (process.env.NODE_ENV === "development") {
  // Must use require here as import statements are only allowed
  // to exist at the top of a file.
  require("preact/debug");
}

import "./firebase";
import { render } from "preact";
import { useEffect } from "preact/hooks";
import { Route, Switch, useLocation, useRoute } from "wouter-preact";
import { Controls } from "./controls";
import { DrawingList } from "./drawing-list";
import { Footer } from "./footer";
import { AuthManager } from "./auth";
import { UpdateManager } from "./update-manager";
import { DrawStateManager } from "./draw-state";
import styles from "./app.css";
import { ConfigStateManager } from "./config-state";
import { SongsPage } from "./songs-page";
import { Header } from "./header";

interface RedirectProps {
  replace?: boolean;
  to: string;
}

function Redirect({ to, replace }: RedirectProps) {
  const [_, setLocation] = useLocation();
  useEffect(() => setLocation(to, replace), [to, replace]);
  return null;
}

function App() {
  const [_, params] = useRoute<{ dataSet: string }>("/:dataSet/:anything*");
  if (!params) {
    return null;
  }

  return (
    <DrawStateManager dataSet={params.dataSet}>
      <UpdateManager />
      <Header />
      <Switch>
        <Route path="/:dataSet">
          <SongsPage />
        </Route>
        <Route path="/:dataSet/draw">
          <Controls />
          <DrawingList />
        </Route>
        <Route path="/:anything*">
          <p>404 Not Found</p>
        </Route>
      </Switch>
      <Footer />
    </DrawStateManager>
  );
}

function AppShell() {
  return (
    <AuthManager>
      <ConfigStateManager>
        <App />
        <Route path="/">
          <Redirect to="/a20" replace />
        </Route>
      </ConfigStateManager>
    </AuthManager>
  );
}

const appRoot = document.createElement("main");
document.body.prepend(appRoot);
appRoot.className = styles.container;
render(<AppShell />, appRoot);
