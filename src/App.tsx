import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";
import HomePage from "../app/page";
import AdminPage from "../app/admin/page";
import AdminEventsPage from "../app/admin/events/page";
import AdminFinancePage from "../app/admin/finance/page";
import AdminModerationPage from "../app/admin/moderation/page";
import AdminOrganizersPage from "../app/admin/organizers/page";
import AdminSettingsPage from "../app/admin/settings/page";
import AdminSupportPage from "../app/admin/support/page";
import AdminUsersPage from "../app/admin/users/page";
import ArtistPage from "../app/artist/mesut-sure/page";
import LoginPage from "../app/auth/login/page";
import RegisterPage from "../app/auth/register/page";
import CheckoutPage from "../app/checkout/page";
import CompanyPage from "../app/company/bkm/page";
import DiscoverPage from "../app/discover/page";
import MatchPage from "../app/match/page";
import SuggestionPage from "../app/ne-yapayim/page";
import NotificationsPage from "../app/notifications/page";
import OnboardingPage from "../app/onboarding/page";
import OrganizerPage from "../app/organizer/page";
import OrganizerCampaignsPage from "../app/organizer/campaigns/page";
import OrganizerEventsPage from "../app/organizer/events/page";
import OrganizerNewEventPage from "../app/organizer/events/new/page";
import OrganizerFinancePage from "../app/organizer/finance/page";
import OrganizerReportsPage from "../app/organizer/reports/page";
import OrganizerSalesPage from "../app/organizer/sales/page";
import OrganizerTeamPage from "../app/organizer/team/page";
import OrganizerTicketsPage from "../app/organizer/tickets/page";
import ProfilePage from "../app/profile/page";
import RewardsPage from "../app/rewards/page";
import SupportPage from "../app/support/page";
import TicketsPage from "../app/tickets/page";
import VenuePage from "../app/venue/milyon-performance-hall/page";
import { DemoEventExperience } from "../app/demo-event/[slug]/DemoEventExperience";
import { EventExperience } from "../app/event/[slug]/EventExperience";
import { findEvent } from "../app/data/events";
import { currentRoute, navigateTo } from "./router";

const exactRoutes: Record<string, () => React.JSX.Element> = {
  "/": HomePage,
  "/admin": AdminPage,
  "/admin/events": AdminEventsPage,
  "/admin/finance": AdminFinancePage,
  "/admin/moderation": AdminModerationPage,
  "/admin/organizers": AdminOrganizersPage,
  "/admin/settings": AdminSettingsPage,
  "/admin/support": AdminSupportPage,
  "/admin/users": AdminUsersPage,
  "/artist/mesut-sure": ArtistPage,
  "/auth/login": LoginPage,
  "/auth/register": RegisterPage,
  "/checkout": CheckoutPage,
  "/company/bkm": CompanyPage,
  "/discover": DiscoverPage,
  "/match": MatchPage,
  "/ne-yapayim": SuggestionPage,
  "/notifications": NotificationsPage,
  "/onboarding": OnboardingPage,
  "/organizer": OrganizerPage,
  "/organizer/campaigns": OrganizerCampaignsPage,
  "/organizer/events": OrganizerEventsPage,
  "/organizer/events/new": OrganizerNewEventPage,
  "/organizer/finance": OrganizerFinancePage,
  "/organizer/reports": OrganizerReportsPage,
  "/organizer/sales": OrganizerSalesPage,
  "/organizer/team": OrganizerTeamPage,
  "/organizer/tickets": OrganizerTicketsPage,
  "/profile": ProfilePage,
  "/rewards": RewardsPage,
  "/support": SupportPage,
  "/tickets": TicketsPage,
  "/venue/milyon-performance-hall": VenuePage,
};

const pageTitles: Record<string, string> = {
  "/": "BULUŞ — Şehrinle buluş",
  "/admin": "Yönetim merkezi | BULUŞ",
  "/organizer": "Organizatör paneli | BULUŞ",
  "/discover": "Etkinlikleri keşfet | BULUŞ",
  "/checkout": "Koltuk ve demo ödeme | BULUŞ",
  "/tickets": "Biletlerim | BULUŞ",
  "/profile": "Profilim | BULUŞ",
};

function normalizePath(route: string) {
  const path = route.split("?")[0].replace(/\/+$/, "");
  return path || "/";
}

function RouteContent({ route }: { route: string }) {
  const path = normalizePath(route);
  const ExactPage = exactRoutes[path];
  if (ExactPage) return <ExactPage />;

  if (path.startsWith("/demo-event/")) {
    return <DemoEventExperience slug={decodeURIComponent(path.slice("/demo-event/".length))} />;
  }
  if (path.startsWith("/event/")) {
    return <EventExperience event={findEvent(decodeURIComponent(path.slice("/event/".length)))} />;
  }

  return (
    <main className="demo-event-page">
      <section className="demo-missing">
        <span>404</span>
        <h1>Bu sayfayı bulamadık</h1>
        <p>Bağlantı değişmiş olabilir. Ana sayfadan bütün çalışan alanlara ulaşabilirsin.</p>
        <a href="/">Ana sayfaya dön →</a>
      </section>
    </main>
  );
}

export function App() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    const refresh = () => setRoute(currentRoute());
    window.addEventListener("hashchange", refresh);
    return () => window.removeEventListener("hashchange", refresh);
  }, []);

  useEffect(() => {
    const path = normalizePath(route);
    document.title = path.startsWith("/event/") ? `${findEvent(path.slice(7)).title} | BULUŞ` : (pageTitles[path] ?? "BULUŞ — Etkinlik ve bilet platformu");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [route]);

  function handleLink(event: ReactMouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest("a");
    if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
    const href = anchor.getAttribute("href");
    if (!href) return;

    if (href.startsWith("/")) {
      event.preventDefault();
      navigateTo(href);
      return;
    }
    if (href.startsWith("#") && !href.startsWith("#/")) {
      event.preventDefault();
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div onClickCapture={handleLink}>
      <RouteContent route={route} />
    </div>
  );
}
