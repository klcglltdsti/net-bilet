export function currentRoute() {
  const hash = window.location.hash;
  return hash.startsWith("#/") ? decodeURI(hash.slice(1)) : "/";
}

export function currentSearchParams() {
  const query = currentRoute().split("?")[1] ?? "";
  return new URLSearchParams(query);
}

export function navigateTo(target: string) {
  const route = target.startsWith("/") ? target : `/${target}`;
  if (currentRoute() === route) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    return;
  }
  window.location.hash = route;
}
