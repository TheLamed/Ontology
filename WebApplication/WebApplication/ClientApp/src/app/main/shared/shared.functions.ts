export function setCookie(key: string, value: string);
export function setCookie(key: string, value: string, time ?: Date) {
  const val = value;
  let cookie = key + '=' + val;

  if (time != null)
    cookie += "; expires=" + time.toUTCString()

  cookie += "; path=/";

  document.cookie = cookie;
}

export function getCookie(key: string): string {
  const value = "; " + document.cookie;
  const parts = value.split("; " + key + "=");

  if (parts == null) return null;

  if (parts.length == 2) {
    return parts.pop().split(";").shift();
  }
}
