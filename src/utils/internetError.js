import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

function InternetError() {
  const [isOnline, setIsOnline] = useState(true); // Default to true, assuming the user is online initially
  const router = useRouter();

  useEffect(() => {
    // Check if we're on the client side and only then access the navigator
    if (typeof window !== "undefined") {
      // Set the initial status based on the online status
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      // Add event listeners for online and offline events
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Check and show SweetAlert immediately if offline
      if (!navigator.onLine) {
        showOfflineAlert();
      }

      // Listen to route changes
      const handleRouteChange = (url) => {
        if (!navigator.onLine) {
          showOfflineAlert();
        }
      };

      router.events.on("routeChangeStart", handleRouteChange);

      // Cleanup the event listeners on unmount
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        router.events.off("routeChangeStart", handleRouteChange); // Clean up the route change listener
      };
    }
  }, []);

  const showOfflineAlert = () => {
    Swal.fire({
      icon: "error",
      title: "No Internet Connection",
      text: "Please check your connection and try again.",
      showCancelButton: false,
      confirmButtonText: "Retry",
      confirmButtonColor: "#DD6B55",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  };

  return (
    <div>
    </div>
  );
}

export default InternetError;
