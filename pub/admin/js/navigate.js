export function navigateInClient(e) {
    e.preventDefault();
    const href = e.target.href;
    if(!href) return;
    history.pushState(null, "", href);
    e.target.dispatchEvent(new CustomEvent("navigate-in-client", { bubbles: true }));

}
