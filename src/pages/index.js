import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import PageLoading from "../components/page-loading";
import { setStorage } from "../utils/storages";
import { useRouter } from "next/router";

export default function Home() {
  const { instance, accounts, inProgress } = useMsal();
  const router = useRouter();

  useEffect(() => {
    if (inProgress === "none") {
      if (accounts.length > 0) {
        setStorage("token", accounts[0].idToken);
        console.log("✅ User authenticated. Redirecting to dashboard...");
        router.replace("/projects");
      } else {
        router.push("/login");
      }
    }
  }, [instance, accounts, inProgress, router]);

  return <></>;
}
