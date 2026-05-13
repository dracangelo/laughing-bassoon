export function buildGaPageView(path: string, title: string) {
  return {
    event: "page_view",
    page_title: title,
    page_location: path
  };
}

export function buildCommerceEvent(name: string, payload: Record<string, unknown>) {
  return {
    event: name,
    ...payload
  };
}
