/*
  Only God and me know how this works
  Him more than me. 
*/
export default function pathcheck(
  currentPath: string,
  protectedPaths: string[]
): boolean {
  for (let i = 0; i < protectedPaths.length; i++) {
    let protectedPath = protectedPaths[i];
    let escapedPath = protectedPath.replace(/[-\/\\^$+?.()|[\]{}]/g, "\\$&");
    if (protectedPath.endsWith("/*")) {
      escapedPath = escapedPath.replace(/\\\*$/, "");
      const pattern = `^${escapedPath}(?:/.*)?$`;
      try {
        const regex = new RegExp(pattern);
        const m = regex.test(currentPath);
        if (m) return true;
      } catch (error) {
        return false;
      }
    } else {
      const pattern = `^${escapedPath}$`;

      try {
        const regex = new RegExp(pattern);
        const m = regex.test(currentPath);
        if (m) return true;
      } catch (error) {
        return false;
      }
    }
  }
  return false;
}
