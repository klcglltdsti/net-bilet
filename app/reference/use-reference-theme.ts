import { useEffect } from "react";
import baseCss from "../netbilet-base.css?inline";
import homeCss from "../netbilet-home.css?inline";
import detailCss from "./EventDetail.css?inline";
import checkoutCss from "./Checkout.css?inline";
import artistCss from "./ArtistProfile.css?inline";
import venueCss from "./VenueProfile.css?inline";
import profileCss from "./Profile.css?inline";
import integrationCss from "./integration.css?inline";
import responsiveCss from "./responsive.css?inline";

export type ReferenceScreen = "home" | "event" | "checkout" | "artist" | "venue" | "profile";

const screenCss: Record<ReferenceScreen, string[]> = {
  home: [homeCss],
  event: [detailCss],
  checkout: [detailCss, checkoutCss],
  artist: [homeCss, detailCss, artistCss],
  venue: [homeCss, detailCss, artistCss, venueCss],
  profile: [homeCss, detailCss, checkoutCss, profileCss],
};

export function useReferenceTheme(screen: ReferenceScreen = "home") {
  useEffect(() => {
    const style = document.createElement("style");
    style.dataset.netbiletReference = "true";
    style.dataset.netbiletScreen = screen;
    style.textContent = [baseCss, ...screenCss[screen], integrationCss, responsiveCss].join("\n");
    document.head.append(style);
    document.body.classList.add("netbilet-reference-page");
    document.body.classList.add(`netbilet-screen-${screen}`);
    return () => {
      style.remove();
      document.body.classList.remove("netbilet-reference-page");
      document.body.classList.remove(`netbilet-screen-${screen}`);
    };
  }, [screen]);
}
