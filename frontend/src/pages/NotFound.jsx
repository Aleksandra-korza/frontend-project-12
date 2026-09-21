import React from "react";
import i18next from "i18next";

function NotFound() {
    return (
      <>
        <header>
          <Link to="/">{i18next.t(($) => $.nameChat)}</Link>
        </header>
        <h1>{i18next.t(($) => $.error404)}</h1>
        <p>{i18next.t(($) => $.noPage)}</p>
      </>
    );
  }
  
  export default NotFound;