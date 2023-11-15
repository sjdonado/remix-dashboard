import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, NavLink, Outlet, useLoaderData, useNavigation } from "@remix-run/react";

import { auth } from "~/actions/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const email = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return json({ email });
};

export default function MainLayout() {
  const navigation = useNavigation();
  const { email } = useLoaderData<typeof loader>();

  const LogoutBtn = () => (
    <Form
      method="post"
      action="/logout"
      onSubmit={(event) => {
        const response = confirm(
          "Are you sure you want to log out? You will be redirected to the login page.",
        );
        if (!response) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit">Log Out</button>
    </Form>
  );

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-base-300">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">{email}</div>
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal">
              <li className="mr-2">
                <NavLink to="/" className={({ isActive, isPending }) => isActive ? "active" : isPending ? "pending" : ""}>
                  Home
                </NavLink>
              </li>
              <li className="mr-2">
                <NavLink to="/inbox" className={({ isActive, isPending }) => isActive ? "active" : isPending ? "pending" : ""}>
                  Inbox
                </NavLink>
              </li>
              <li><LogoutBtn /></li>
            </ul>
          </div>
        </div>
        <div
          id="main"
          className={
            navigation.state === "loading"
              ? "loading transition-opacity duration-1000"
              : "transition-opacity duration-1000"
          }
        >
          <Outlet />
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          <li>
            <NavLink to="/" className={({ isActive, isPending }) => isActive ? "active" : isPending ? "pending" : ""}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/inbox" className={({ isActive, isPending }) => isActive ? "active" : isPending ? "pending" : ""}>
              Inbox
            </NavLink>
          </li>
          <li><LogoutBtn /></li>
        </ul>
      </div>
    </div>
  );
}
