import Link from "next/link";
import { FunctionComponent } from "react";

export interface AdminTab {
  uri: string
  caption: string
}
export const AdminContainer: FunctionComponent<{
  tabs: Array<AdminTab>
  uri: string
}> = ({ tabs, uri, children }) => {

  return (
    <>
      <ul className="nav nav-tabs">{(
        tabs.map(({ uri: pageUri, caption }) => {
          return (
            <li className="nav-item" key={pageUri}>
              <Link
                key={pageUri}
                href={pageUri}

              >
                <a className={`nav-link ${uri === pageUri ? "active" : ""}`}>{caption}</a>
              </Link>
            </li>
          );
        }))}</ul>

      {children}
    </>
  )

};
