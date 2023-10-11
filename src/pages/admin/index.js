import NavBar from "../../jsx/layouts/nav";

 
export default function Layout({ children }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  )
}