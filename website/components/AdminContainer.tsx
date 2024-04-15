import Link from "next/link";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

export interface AdminTab {
  uri: string
  caption: string
}
export const AdminContainer: FunctionComponent<{
  tabs: Array<AdminTab>
  uri: string
}> = ({ tabs, children }) => {
  const router = useRouter()

  return (
    <>
      <ul className="nav nav-tabs">{(
        tabs.map(({ uri, caption }) => {
          return (
            <li className="nav-item" key={uri}>
              <Link
                key={uri}
                href={uri}

              >
                <a className={`nav-link ${router.asPath === uri ? "active" : ""}`}>{caption}</a>
              </Link>
            </li>
          );
        }))}</ul>

      {children}
    </>
  )

};
