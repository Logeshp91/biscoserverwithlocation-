export function handleNotificationNavigation(data) {
  if (!data) return;

  console.log("Navigate from Notification:", data);

  const screen = data.navigationId;

  if (screen && global.myNavigation) {
    try {
      global.myNavigation.navigate(screen);
    } catch (e) {
      console.log("Navigation Error:", e);
    }
  }
}
